const QuestionCard = ({ question }: { question: string }) => {
    return (
      <div className="bg-white p-4 rounded shadow mb-2">
        <p>{question}</p>
      </div>
    );
  };
  
  export default QuestionCard;
  