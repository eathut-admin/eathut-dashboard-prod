const LoginAnimation = () => {
  return (
    <div className="flex space-x-4">
      {["E", "A", "T", "H", "U", "T"].map((letter, index) => (
        <div className="loader" key={index}>
          <svg viewBox="0 0 80 80" className="w-10 h-10">
            <rect x="8" y="8" width="64" height="64"></rect>
            <text
              x="50%"
              y="60%"
              textAnchor="middle"
              fill="#fb992b"
              fontSize="25"
              fontWeight="bold">
              {letter}
            </text>
          </svg>
        </div>
      ))}
    </div>
  );
};

export default LoginAnimation;
