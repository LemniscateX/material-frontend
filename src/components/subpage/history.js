import React, { useEffect, useState } from 'react';
import { fetchHistoryList } from '../../api/api';

const HistoryPage = () => {
  const [state, setState] = useState({
    histories: [],
  });

  useEffect(() => {
    fetchHistoryList().then((histories) => {
      setState({ histories: histories });
    })
  }, [setState]);

  return (
    <ul>
      {state.histories.map((m) => (
        <li>{m.log}</li>
      ))}
    </ul>
  )
}

export default HistoryPage;