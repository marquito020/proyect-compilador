import React, { useState } from 'react';

const Interfaz = () => {
  const [text, setText] = useState('');
  const [preanalisis, setPreanalisis] = useState('');
  const [lexema, setLexema] = useState('');
  const [highlight, setHighlight] = useState({ start: -1, end: -1 });

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleInitClick = () => {
    // Lógica para inicializar la cinta y el analizador léxico
    // ...
    setPreanalisis(''); // Actualizar el estado con el preanálisis
    setLexema(''); // Actualizar el estado con el lexema
    setHighlight({ start: -1, end: -1 }); // Limpiar el resaltado
  };

  const handleAvanzarClick = () => {
    // Lógica para avanzar en el análisis léxico
    // ...
    setPreanalisis(''); // Actualizar el estado con el preanálisis
    setLexema(''); // Actualizar el estado con el lexema
    setHighlight({ start: -1, end: -1 }); // Limpiar el resaltado
  };

  const handleTextAreaHighlight = (event) => {
    const selectionStart = event.target.selectionStart;
    const selectionEnd = event.target.selectionEnd;
    setHighlight({ start: selectionStart, end: selectionEnd });
  };

  return (
    <div>
      <textarea value={text} onChange={handleChange} onSelect={handleTextAreaHighlight} />
      <button onClick={handleInitClick}>Init</button>
      <button onClick={handleAvanzarClick}>Avanzar</button>
      <div>
        <label>Preanálisis:</label>
        <input type="text" value={preanalisis} readOnly />
      </div>
      <div>
        <label>Lexema:</label>
        <input type="text" value={lexema} readOnly />
      </div>
    </div>
  );
};

export default Interfaz;
