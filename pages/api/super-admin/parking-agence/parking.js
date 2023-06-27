import prisma from '@/lib/prisma';

export default async function handle(req, res) {
    const { method } = req;

    try {
        if (method === 'POST') {
            // Handle POST method
            const { name, city, address, agencyName } = req.body;

            // Find the agency by its name
            const agency = await prisma.agency.findUnique({
                where: {
                    name: agencyName,
                },
            });

            if (!agency) {
                return res.status(400).json({ message: 'No agency matching this name.' });
            }

            // Create the new parking with the agency ID
            const newParking = await prisma.parking.create({
                data: {
                    name: name,
                    city: city,
                    address: address,
                    agencyId: agency.id,
                },
            });

            // Send a success response
            return res.status(200).json({ message: 'Parking added successfully.', parking: newParking });

        } else if (method === 'GET') {
            // Handle GET method
            const { id } = req.query;

            if (id) {
                // Retrieve a parking by its ID
                const parking = await prisma.parking.findUnique({
                    where: { id: parseInt(id) },
                    include: { Agency: true },
                });

                if (!parking) {
                    return res.status(404).json({ message: 'Parking not found.' });
                }

                return res.json(parking);
            } else {
                // Retrieve all parkings
                const parkings = await prisma.parking.findMany({
                    include: { Agency: true },
                });

                return res.json(parkings);
            }

        } else if (method === 'PUT') {
            // Handle PUT method
            const { id, name, city, address, image, agencyName } = req.body;

            // Check if the parking exists
            const existingParking = await prisma.parking.findUnique({
                where: { id: parseInt(id) },
                include: { Agency: true },
            });

            if (!existingParking) {
                return res.status(404).json({ message: 'Parking not found.' });
            }

            // Check if the agency exists
            const existingAgency = await prisma.agency.findUnique({
                where: { name: agencyName },
            });

            if (!existingAgency) {
                return res.status(400).json({ message: 'No agency matching this name.' });
            }

            // Check if the parking is already assigned to an agency
            if (existingParking.Agency && existingParking.Agency.id !== existingAgency.id) {
                return res.status(400).json({ message: 'This parking is already assigned to an agency.' });
            }

            // Update the parking
            const updatedParking = await prisma.parking.update({
                where: { id: parseInt(id) },
                data: { name, city, address, image, agencyId: existingAgency.id },
                include: { Agency: true },
            });

            return res.json(updatedParking);
        }
        else if (method === 'DELETE') {
            // Handle DELETE method
            if (req.query?.id) {
                const parkingId = req.query.id;
                const parking = await prisma.parking.findUnique({
                    where: { id: Number(parkingId) },
                    include: { Agency: true },
                });

                if (!parking) {
                    return res.status(404).json({ message: 'Parking not found.' });
                }

                res.json(await prisma.parking.delete({
                    where: { id: Number(parkingId) },
                    include: { Agency: true },
                }));
                res.json(parking)
            }

        } else {
            return res.status(405).json({ message: 'Method not allowed.' });
        }

    } catch (error) {
        // Handle errors that occur during database interactions
        res.status(500).json({ message: 'An error occurred.', error: error.message });
    }
}
