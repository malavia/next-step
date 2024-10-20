function StepList({ steps, currentStep }) {
    return (
      <div className="steps-container">
        <ol className="steps-list">
          {steps.map((step, index) => (
            <li key={index} className="step-item">
              {step}
            </li>
          ))}
          {currentStep && (
            <li className="step-item current">
              {currentStep}
            </li>
          )}
        </ol>
      </div>
    );
  }
  
  export default StepList;
  