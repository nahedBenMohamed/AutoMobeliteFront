import React from 'react';
import 'boxicons/css/boxicons.min.css';

const Home = () => {
    return (
            <main>
                <ul className="box-info">
                    <li>
                        <i className="bx bxs-calendar-check"></i>
                        <span className="text">
                          <h3>1020</h3>
                          <p>New Order</p>
                        </span>
                    </li>
                    <li>
                        <i className="bx bxs-group"></i>
                        <span className="text">
                          <h3>2834</h3>
                          <p>Visitors</p>
                        </span>
                    </li>
                    <li>
                        <i className="bx bxs-dollar-circle"></i>
                        <span className="text">
                          <h3>$2543</h3>
                          <p>Total Sales</p>
                        </span>
                    </li>
                </ul>
                <div className="table-data">
                    <div className="order">
                        <div className="head">
                            <h3>Recent Orders</h3>
                        </div>
                        <table>
                            <thead>
                            <tr>
                                <th>User</th>
                                <th>Date Order</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </main>
    );
};

export default Home;
