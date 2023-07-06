import React, {useEffect, useRef, useState} from 'react'
import { Bar,Doughnut } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    BarElement,
    ArcElement,
    DoughnutController,
    CategoryScale,
    LinearScale,
    PointElement,
} from "chart.js";
import axios from "axios";
import {toast} from "react-toastify";
import Link from "next/link";
import {FiEdit, FiInfo, FiTrash2} from "react-icons/fi";
import {useRouter} from "next/router";

ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    DoughnutController,
    PointElement,
    ArcElement,
);

function FinanceDoughnutChart({ data }) {
    const chartData = {
        labels: ['Revenue', 'Expense', 'Gain'],
        datasets: [
            {
                data: [data.revenue, data.expense, data.net],
                backgroundColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(153, 102, 255, 1)'],
                hoverBackgroundColor: ['rgba(75, 192, 192, 0.8)', 'rgba(255, 99, 132, 0.8)', 'rgba(153, 102, 255, 0.8)'],
            }
        ],
    };

    // Options for the Doughnut chart
    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.label;
                        let value = context.parsed;
                        return label + ': ' + value;
                    }
                }
            }
        }
    }

    // Ref to hold the div element that will be centered in the doughnut chart
    const centerEl = useRef(null);

    useEffect(() => {
        if (centerEl.current) {
            const chartContainer = centerEl.current.parentNode;
            centerEl.current.style.position = 'absolute';
            centerEl.current.style.top = '50%';
            centerEl.current.style.left = '50%';
            centerEl.current.style.transform = 'translate(-50%, -50%)';
            centerEl.current.style.zIndex = 2;  // Ensure it's above the chart layers
            centerEl.current.style.fontSize = '24px';  // Adjust as needed
        }
    }, [])

    return (
        <div style={{ position: 'relative' }}>
            <Doughnut data={chartData} options={options} />
            <div ref={centerEl}>
                {data.net} DT
            </div>
        </div>
    );
}


// Component for displaying revenue and expense data
function FinanceChartRevenusDepense({ data }) {
    const chartData = {
        labels: data.map(d => d.month),
        datasets: [
            {
                label: "Revenue",
                data: data.map(d => d.revenue),
                backgroundColor: "rgba(75, 192, 192, 1)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1
            },
            {
                label: "Expense",
                data: data.map(d => d.expense),
                backgroundColor: "rgba(255, 99, 132, 1)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1
            }
        ]
    }
    const options = {
        scales: {
            x : {
                grid:{
                    display: false,
                }
            },
            y : {
                beginAtZero: true,
            }
        },
    };

    return <Bar data={chartData} options={options} />
}
function RevenusDepenses() {
    const [data, setData] = useState([]);
    const [cars, setCars] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [carsPerPage] = useState(5);
    const [selectedCarId, setSelectedCarId] = useState(null);

    const router = useRouter();
    const { carId } = router.query;

    // Calculer les totaux pour l'année
    const totals = {
        revenue: data.reduce((acc, cur) => acc + cur.revenue, 0),
        expense: data.reduce((acc, cur) => acc + cur.expense, 0),
        net: data.reduce((acc, cur) => acc + cur.net, 0)
    }

    useEffect(() => {
        axios.get('/api/admin/manage-cars/cars', { withCredentials: true })
            .then((response) => {
                setCars(response.data.reverse());
            })
            .catch((error) => {
                if (error.response) {
                    toast.warning('An error occurred while loading data',
                        {
                            position: "top-center",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: false,
                            progress: undefined,
                            theme: "colored",
                        });
                }
            });
    }, []);

    useEffect(() => {
        const url = selectedCarId ? `/api/admin/rapport/rapport?carId=${selectedCarId}` : '/api/admin/rapport/rapport';
        async function fetchData() {
            const res = await fetch(url)
            const data = await res.json()
            setData(data)
        }

        fetchData()
    }, [selectedCarId]);

    // CSS styles for the cards
    const cardStyle = {
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        margin: '20px',
        backgroundColor: '#fff',
        flex: '1 1 0',  // added this to allow the card to grow and shrink as needed
    }

    const headerStyle = {
        marginBottom: '15px',
        fontWeight: 'bold',
        textAlign: 'center',
    }

    const indexOfLastCar = currentPage * carsPerPage;
    const indexOfFirstCar = indexOfLastCar - carsPerPage;
    const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '20px' }}>
                <button
                    onClick={() => setSelectedCarId(null)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Rapport pour toutes les voitures
                </button>
                <div>
                    <input
                        type="text"
                        placeholder="Search Cars..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="ml-4 py-2 px-4 border border-gray-300 rounded-3xl"
                    />
                </div>
            </div>
            <div style={{...cardStyle, marginTop: '20px', width: '100%'}}>
                <p style={headerStyle}>Revenus VS Depenses</p>
                <div style={{width: '100%', height: '500px'}}>
                    <FinanceChartRevenusDepense data={data} />
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row-reverse', width: '100%' }}>
                <div style={{...cardStyle, flex: '0.4'}}>
                    <p style={headerStyle}>Gains</p>
                    <div style={{ height: '300px', width: '100%' }}>
                        <FinanceDoughnutChart data={totals} />
                    </div>
                </div>
                <div style={{...cardStyle, flex: '1.3'}}>
                    <p style={headerStyle}>Liste des voitures</p>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                        <tr></tr>
                        </thead>
                        <tbody>
                        {currentCars
                            .filter((car) =>
                                car.brand.toLowerCase().includes(search.toLowerCase()) ||
                                car.model.toLowerCase().includes(search.toLowerCase()) ||
                                car.year.toString().includes(search) ||
                                car.mileage.toString().includes(search) ||
                                car.price.toString().includes(search) ||
                                car.registration.toLowerCase().includes(search.toLowerCase()) ||
                                car.status.toLowerCase().includes(search.toLowerCase()) ||
                                car.fuel.toLowerCase().includes(search.toLowerCase()) ||
                                car.door.toString().includes(search) ||
                                car.gearBox.toLowerCase().includes(search.toLowerCase())
                            )
                            .map((car) => (
                                <tr key={car.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{car.brand}</td>
                                    <td className="px-6 py-4 flex justify-center">
                                        <a onClick={() => setSelectedCarId(car.id)} className="text-blue-500 hover:text-blue-700 mx-1 flex items-center cursor-pointer">
                                            <FiInfo size={18} className="mr-2" />
                                            <span>Rapport</span>
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-center mt-4">
                        {cars.length > carsPerPage && (
                            <ul className="flex items-center">
                                {Array.from({ length: Math.ceil(cars.length / carsPerPage) }).map((_, index) => (
                                    <li key={index}>
                                        <button
                                            className={`${
                                                currentPage === index + 1
                                                    ? 'bg-blue-500 hover:bg-blue-700 text-white'
                                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                                            } font-bold py-2 px-4 mx-1 rounded`}
                                            onClick={() => paginate(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RevenusDepenses
