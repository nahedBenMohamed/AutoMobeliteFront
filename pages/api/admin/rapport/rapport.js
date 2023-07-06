import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    // get start of the current year
    const yearStart = new Date(new Date().getFullYear(), 0, 1)

    // get carId from the query parameters
    const carId = req.query.carId;

    const rentalsWhere = carId ?
        { startDate: { gte: yearStart }, carId: parseInt(carId) } :
        { startDate: { gte: yearStart } };

    // calculate revenues for each month
    const rentals = await prisma.rental.findMany({
        select: {
            total: true,
            startDate: true
        },
        where: rentalsWhere,
        orderBy: {
            startDate: 'asc'
        }
    });

    const monthlyRevenues = Array(12).fill(0)
    rentals.forEach(rental => {
        const month = rental.startDate.getMonth()
        monthlyRevenues[month] += rental.total
    })

    const maintenancesWhere = carId ?
        { startDate: { gte: yearStart }, carId: parseInt(carId) } :
        { startDate: { gte: yearStart } };

    // calculate expenses for each month
    const maintenances = await prisma.maintenance.findMany({
        select: {
            cost: true,
            startDate: true
        },
        where: maintenancesWhere,
        orderBy: {
            startDate: 'asc'
        }
    });

    const monthlyExpenses = Array(12).fill(0)
    maintenances.forEach(maintenance => {
        const month = maintenance.startDate.getMonth()
        monthlyExpenses[month] += maintenance.cost
    })

    // prepare the data for the response
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const data = months.map((month, i) => ({
        month,
        revenue: monthlyRevenues[i],
        expense: monthlyExpenses[i],
        net: monthlyRevenues[i] - monthlyExpenses[i]
    }))

    res.status(200).json(data)
}
