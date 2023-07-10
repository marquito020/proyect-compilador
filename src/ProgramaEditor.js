import React from "react";

const ProgramaEditor = ({ programa, lexema }) => {
  const resaltarLexema = () => {
    if (!lexema) {
      return programa;
    }

    const inicioLexema = programa.indexOf(lexema);
    const finLexema = inicioLexema + lexema.length;
    const textoAnterior = programa.slice(0, inicioLexema);
    const textoResaltado = programa.slice(inicioLexema, finLexema);
    const textoPosterior = programa.slice(finLexema);

    return (
      <>
        {textoAnterior}
        <span className="resaltado-lexema">{textoResaltado}</span>
        {textoPosterior}
      </>
    );
  };

  return <div className="programa-editor">{resaltarLexema()}</div>;
};

export default ProgramaEditor;
