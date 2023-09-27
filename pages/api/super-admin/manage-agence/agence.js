import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

export default async function handle(req, res) {
  const { method } = req;

  try {
    if (method === "POST") {
      // Handle POST method
      const { name, address, email, telephone, responsibleEmail } = req.body;

      // Check if the responsible email is the superAdmin's email
      const superAdminEmail = "mobelite@gmail.com"; // Replace with the superAdmin's email

      if (responsibleEmail === superAdminEmail) {
        return res
          .status(400)
          .json({
            message: "Cannot assign superAdmin as responsible for an agency",
          });
      }

      // Vérifier si l'agence existe déjà
      const existingAgence = await prisma.agency.findUnique({
        where: {
          name: name,
        },
      });

      if (existingAgence) {
        return res.status(400).json({ message: "This agency already exists" });
      }

      // Check if an agency with the same email already exists
      const existingAgencyEmail = await prisma.agency.findUnique({
        where: {
          email: email,
        },
      });

      if (existingAgencyEmail) {
        return res
          .status(400)
          .json({ message: "An agency with this email already exists" });
      }

      // Vérifier si le responsable existe et obtenir son id
      const responsible = await prisma.agencyUser.findUnique({
        where: {
          email: responsibleEmail,
        },
      });

      if (!responsible) {
        return res.status(400).json({ message: "Manager does not exist" });
      }

      // Vérifier si le responsable est déjà relié à une agence
      const existingUserId = await prisma.agency.findUnique({
        where: {
          responsibleId: responsible.id,
        },
      });

      if (existingUserId) {
        return res
          .status(400)
          .json({
            message: "This agent is already responsible for another Agency",
          });
      }

      // Créer la nouvelle agence avec la référence au responsable
      const newAgence = await prisma.agency.create({
        data: {
          name: name,
          address: address,
          email: email,
          telephone: telephone,
          responsibleId: responsible.id,
        },
      });

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      let imageUrl;
      if (process.env.NODE_ENV === "development") {
        imageUrl = `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNMUztOoMBnPAYvVulW_GF0189vAJRr3AQEngvD0lpkg&s`;
      }
      // Définir les options pour l'email
      let mailOptions = {
        from: process.env.EMAIL, // Expéditeur
        to: email, // Destinataire
        subject: "Successful Registration on Automobelite",
        html: `
<div style="width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 15px; font-family: Roboto, serif;">
<header style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #444;">Successful Registration on Automobelite</h1>
</header>
<div style="text-align: center;">
    <img src="${imageUrl}" alt="Logo of the agency" style="width: 150px; height: auto; margin-bottom: 30px;">
</div>
<p>Dear <span style="font-weight:bold;text-transform:uppercase;">${
          newAgence.name
        }</span>,</p>
<p>We are pleased to inform you that your agency has been successfully registered on Automobelite. The responsible person for your agency is ${responsible.name.toUpperCase()} with the email address ${responsibleEmail}.</p>
<p>Your responsible can now use their email ${responsibleEmail} to log in and start managing your agency. Enjoy!</p>
<div style="text-align:center;margin:20px;">
    <a href="http://localhost:3000/admin/auth/login" style="background-color: #008CBA; border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;margin: 4px 2px;cursor: pointer;">Login</a>
</div>
<p>If you have any questions or need assistance with your new account, do not hesitate to contact us at ${
          process.env.EMAIL
        }.</p>
<p>Best regards,</p>
<p>The Automobelite Team</p>
<footer style="text-align: center; margin-top: 50px;">
    <p style="color: #777;">&copy; ${new Date().getFullYear()} - Automobelite</p>
</footer>
</div>
    `,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email envoyé: " + info.response);
        }
      });
      // Envoyer une réponse de succès
      return res
        .status(200)
        .json({ message: "Agency added successfully", newAgence });
    } else if (method === "GET") {
      // Handle GET method
      const { id } = req.query;

      if (id) {
        // Retrieve an agency by its ID
        const agency = await prisma.agency.findUnique({
          where: { id: parseInt(id) },
          include: { AgencyUser: true, Cars: true }, // Include the AgencyUser and Cars objects in the response
        });

        if (!agency) {
          return res.status(404).json({ message: "Agency not found." });
        }

        const totalParkings = await prisma.parking.count({
          where: { agencyId: agency.id },
        });

        const totalCars = await prisma.car.count({
          where: { agencyId: agency.id },
        });

        return res.json({ ...agency, totalCars, totalParkings });
      } else {
        // Retrieve all agencies
        const agencies = await prisma.agency.findMany({
          include: { AgencyUser: true },
        });

        const agenciesWithCarCount = await Promise.all(
          agencies.map(async (agency) => {
            const totalCars = await prisma.car.count({
              where: { agencyId: agency.id },
            });
            const totalParkings = await prisma.parking.count({
              where: { agencyId: agency.id },
            });
            return {
              ...agency,
              totalCars,
              totalParkings,
            };
          })
        );

        return res.json(agenciesWithCarCount);
      }
    } else if (method === "PUT") {
      // Handle PUT method
      const {
        id,
        name,
        address,
        email,
        telephone,
        image,
        responsibleEmail,
        isActive,
      } = req.body;

      // Check if the agency exists
      const existingAgency = await prisma.agency.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingAgency) {
        return res.status(404).json({ message: "Agency not found." });
      }

      // Check if the responsible email exists and is not already associated with another agency
      const responsibleUser = await prisma.agencyUser.findUnique({
        where: {
          email: responsibleEmail,
        },
      });

      if (!responsibleUser) {
        return res
          .status(404)
          .json({ message: "Responsible email not found." });
      }

      const associatedAgency = await prisma.agency.findFirst({
        where: {
          responsibleId: responsibleUser.id,
          NOT: {
            id: id,
          },
        },
      });

      if (associatedAgency) {
        return res
          .status(400)
          .json({
            message: "Responsible is already associated with another agency.",
          });
      }

      // Update the agency
      const updatedAgency = await prisma.agency.update({
        where: { id: id },
        data: {
          name: name,
          address: address,
          email: email,
          telephone: telephone,
          image,
          status: isActive ? "activate" : "deactivate", // Update the agency's status
          AgencyUser: {
            connect: {
              id: responsibleUser.id,
            },
          },
        },
        include: { AgencyUser: true },
      });

      return res.json(updatedAgency);
    } else if (method === "DELETE") {
      // Handle DELETE method
      if (req.query?.id) {
        const agencyId = req.query.id;

        // Vérifier si l'agence existe
        const agency = await prisma.agency.findUnique({
          where: { id: Number(agencyId) },
        });

        if (!agency) {
          return res.status(404).json({ message: "Agency not found." });
        }

        try {
          // Supprimer les enregistrements de la table `Availability` qui référencent les voitures de l'agence
          await prisma.availability.deleteMany({
            where: {
              car: {
                agencyId: Number(agencyId),
              },
            },
          });

          // Supprimer les voitures de l'agence
          await prisma.car.deleteMany({
            where: {
              agencyId: Number(agencyId),
            },
          });

          await prisma.parking.deleteMany({
            where: {
              agencyId: Number(agencyId),
            },
          });

          // Supprimer l'agence et ses données associées
          const deletedAgency = await prisma.agency.delete({
            where: { id: Number(agencyId) },
            include: {
              AgencyUser: true, // Inclure l'objet AgencyUser
            },
          });

          return res.json(deletedAgency);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: "An error occurred." });
        }
      } else {
        return res.status(405).json({ message: "Method not allowed." });
      }
    }
  } catch (error) {
    // Handle errors that occur during database interactions
    res
      .status(500)
      .json({ message: "An error occurred.", error: error.message });
  }
}
