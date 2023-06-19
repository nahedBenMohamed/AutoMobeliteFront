import React, { useState } from 'react';
import { Form, FormElement } from '@progress/kendo-react-form';
import { Button } from '@progress/kendo-react-buttons';
import { Stepper } from '@progress/kendo-react-layout';
import AccountDetails from '@/components/client/AccountDetails';
import PersonalDetails from '@/components/client/PersonalDetails';
import PaymentDetails from '@/components/client/PaymentDetails';

const stepPages = [AccountDetails, PersonalDetails, PaymentDetails];

const IndexPage = () => {
    const [step, setStep] = useState(0);
    const [formState, setFormState] = useState({});
    const [steps, setSteps] = useState([
        { label: 'Account Details', isValid: undefined },
        { label: 'Personal Details', isValid: undefined },
        { label: 'Payment Details', isValid: undefined },
    ]);

    const lastStepIndex = steps.length - 1;
    const isLastStep = lastStepIndex === step;
    const isPreviousStepsValid =
        steps.slice(0, step).findIndex((currentStep) => currentStep.isValid === false) === -1;

    const onStepSubmit = (event) => {
        const { isValid, values } = event;

        const currentSteps = steps.map((currentStep, index) => ({
            ...currentStep,
            isValid: index === step ? isValid : currentStep.isValid,
        }));

        setSteps(currentSteps);
        setStep((prevStep) => Math.min(prevStep + 1, lastStepIndex));
        setFormState(values);

        if (isLastStep && isPreviousStepsValid && isValid) {
            alert(JSON.stringify(values));
        }
    };

    const onPrevClick = (event) => {
        event.preventDefault();
        setStep((prevStep) => Math.max(prevStep - 1, 0));
    };

    return (
        <div className="container">
            <Stepper value={step} items={steps} />

            <Form
                initialValues={formState}
                onSubmitClick={onStepSubmit}
                render={(formRenderProps) => (
                    <div className="form-wrapper">
                        <FormElement className="form-element">
                            {React.createElement(stepPages[step])}
                            <span className="form-separator" />

                            <div className="form-buttons">
                                <span className="step-counter">Step {step + 1} of 3</span>
                                <div>
                                    {step !== 0 && (
                                        <Button className="prev-button" onClick={onPrevClick}>
                                            Previous
                                        </Button>
                                    )}
                                    <Button
                                        className="next-button"
                                        themeColor="primary"
                                        disabled={isLastStep ? !isPreviousStepsValid : false}
                                        onClick={formRenderProps.onSubmit}
                                    >
                                        {isLastStep ? 'Submit' : 'Next'}
                                    </Button>
                                </div>
                            </div>
                        </FormElement>
                    </div>
                )}
            />

        </div>
    );
};

export default IndexPage;
