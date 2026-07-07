import React, { useState } from 'react';

  type SettingsModelProps = {
    toggleSettings: () => void;
  };

const SettingsModel: React.FC<SettingsModelProps> = ({ toggleSettings }) => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

    const decrement = () => {
      setCount(count - 1);
    };

    return (
			<div id="setting-model" onClick={toggleSettings}>
				<div className="">
					<h1>Counter: {count}</h1>
					<button onClick={increment}>Increment</button>
					<button onClick={decrement}>Decrement</button>
					<button onClick={toggleSettings}>Close</button>
				</div>
			</div>
		);
  };

  export default SettingsModel;