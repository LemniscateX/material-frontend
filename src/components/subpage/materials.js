import React, { useEffect, useState } from 'react';
import { fetchMaterialList } from '../../api/api';

const MaterialPage = () => {
  const [state, setState] = useState({
    materials: [],
  });

  useEffect(() => {
    fetchMaterialList().then((materials) => {
      setState({ materials: materials });
    })
  }, [setState]);

  return (
    <ul>
      {state.materials.map((m) => (
        <li>{m.name}</li>
      ))}
    </ul>
  )
}

export default MaterialPage;