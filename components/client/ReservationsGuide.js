import { motion } from 'framer-motion';
import { FiMapPin ,FiUser, FiCheckCircle } from 'react-icons/fi';
import Image from 'next/image';
import {MdDirectionsCar} from "react-icons/md";

function ReservationsGuide() {
    return (
        <section className="reservation-guide">
            <div className="container">
                <motion.div
                    className="card"
                    initial={{ opacity: 20, y: 50 }}
                    animate={{ opacity: 6, y: 0 }}
                    transition={{ duration: 1.9 }}
                >
                    <div className="card-content">
                        <div className="steps">
                            <div className="step">
                                <div className="step-icon">
                                    <motion.div whileHover={{ scale: 1.5 }} whileTap={{ scale: 0.9 }}>
                                        <FiMapPin size={50} color="#0077b6" />
                                    </motion.div>
                                </div>
                                <div className="step-description">
                                    <h3 className="step-title">Choose your destination</h3>
                                    <p>and your desired rental dates.</p>
                                </div>
                            </div>

                            <div className="step">
                                <div className="step-icon">
                                    <motion.div whileHover={{ scale: 1.5 }} whileTap={{ scale: 0.9 }}>
                                    <MdDirectionsCar size={50} color="#0077b6" />
                                    </motion.div>
                                </div>
                                <div className="step-description">
                                    <h3 className="step-title">Select your vehicle type</h3>
                                    <p>you would like to rent.</p>
                                </div>
                            </div>

                            <div className="step">
                                <div className="step-icon">
                                    <motion.div whileHover={{ scale: 1.5 }} whileTap={{ scale: 0.9 }}>
                                        <FiUser size={50} color="#0077b6" />
                                    </motion.div>
                                </div>
                                <div className="step-description">
                                    <h3 className="step-title">Fill in your personal information or do not if it is already
                                    automatically filled</h3>
                                    <p>and proceed to confirm your booking.</p>
                                </div>
                            </div>

                            <div className="step">
                                <div className="step-icon">
                                    <motion.div whileHover={{ scale: 1.5 }} whileTap={{ scale: 0.9 }}>
                                        <FiCheckCircle size={50} color="#0077b6" />
                                    </motion.div>
                                </div>
                                <div className="step-description">
                                    <h3 className="step-title">Receive confirmation of your booking</h3>
                                    <p>by e-mail.
                                    Thanks for your trust</p>
                                </div>
                            </div>
                        </div>

                        <div className="illustration">
                            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                                <Image src="/illustration.png" alt="Illustration" width={600} height={900} />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <style jsx>{`
              .reservation-guide {
                padding: 2rem;
              }

              .container {
                display: flex;
                justify-content: center;
              }

              .card {
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 2px 4px rgba(30, 0, 0, 0.1);
                padding: 2rem;
                max-width: 800px;
              }

              .card-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
              }

              .steps {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
              }

              .step {
                display: flex;
                align-items: center;
              }

              .step-icon {
                margin-right: 1rem;
              }

              .step-title {
                font-size: 1.5rem;
                margin-bottom: 0.5rem;
              }

              .step-description {
                text-align: left;
              }

              .illustration {
                display: flex;
                align-items: center;
                justify-content: center;
              }
            `}</style>
        </section>
    );
}

export default ReservationsGuide;
