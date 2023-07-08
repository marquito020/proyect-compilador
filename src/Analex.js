import React, { useState } from "react";

// Clase Token
class Token {
  constructor(lexema, tipo) {
    this.lexema = lexema;
    this.tipo = tipo;
  }

  toString() {
    return `<${this.tipo}, ${this.lexema}>`;
  }
}

// Clase Cinta
class Cinta {
  constructor(inputText) {
    this.lexemes = inputText
      .replace(/(\/\/.*)|(\/\*[\s\S]*?\*\/)/g, "") // Eliminar comentarios de línea y multilínea
      .split(/\s+|\b(?<!')(?=[(),;])|(?<=[(),;])(?!['])\b|\(|\)/)
      .filter((lexeme) => lexeme !== ""); // Filtrar lexemas vacíos

    this.currentIndex = 0;
  }

  hasNext() {
    return this.currentIndex < this.lexemes.length;
  }

  getNextLexeme() {
    const lexeme = this.lexemes[this.currentIndex];
    this.currentIndex++;
    return lexeme;
  }
}

function AppLexema() {
  const [inputText, setInputText] = useState("");
  const [tokens, setTokens] = useState([]);

  const analyzeLexemes = () => {
    const cinta = new Cinta(inputText);

    const recognizedTokens = [];

    while (cinta.hasNext()) {
      const lexeme = cinta.getNextLexeme();

      let token = recognizeToken(lexeme);

      if (token === null) {
        token = recognizeComplexToken(lexeme,cinta);
      }

      if (token === null) {
        token = recognizeUnsignedNumber(lexeme);
      }

      if (token === null) {
        token = recognizeIdentifier(lexeme);
      }

      if (token === null) {
        token = recognizeStringConstant(lexeme);
      }

      if (token === null) {
        token = new Token(lexeme, "ERROR");
      }

      recognizedTokens.push(token);
    }

    setTokens(recognizedTokens);
  };

  const recognizeToken = (lexeme) => {
    switch (lexeme) {
      case "":
        return new Token("_", "FIN");
      case "main":
        return new Token(lexeme, "MAIN");
      case "void":
        return new Token(lexeme, "VOID");
      case "if":
        return new Token(lexeme, "IF");
      case "else":
        return new Token(lexeme, "ELSE");
      case "for":
        return new Token(lexeme, "FOR");
      case "to":
        return new Token(lexeme, "TO");
      case "while":
        return new Token(lexeme, "WHILE");
      case "repeat":
        return new Token(lexeme, "REPEAT");
      case "until":
        return new Token(lexeme, "UNTIL");
      case "readln":
        return new Token(lexeme, "READLN");
      case "print":
        return new Token(lexeme, "PRINT");
      case "println":
        return new Token(lexeme, "PRINTLN");
      case ",":
        return new Token(lexeme, "COMA");
      case ";":
        return new Token(lexeme, "PTOCOMA");
      case ":":
        return new Token(lexeme, "DOSPUNTOS");
      case "(":
        return new Token(lexeme, "PA");
      case ")":
        return new Token(lexeme, "PC");
      case "{":
        return new Token(lexeme, "LA");
      case "}":
        return new Token(lexeme, "LC");
      case ":=":
        return new Token(lexeme, "ASSIGN");
      case "not":
      case "!":
        return new Token(lexeme, "NOT");
      case "and":
      case "&":
        return new Token(lexeme, "AND");
      case "or":
      case "|":
        return new Token(lexeme, "OR");
      case "false":
        return new Token(lexeme, "FALSE");
      case "true":
        return new Token(lexeme, "TRUE");
      case "+":
        return new Token(lexeme, "MAS");
      case "-":
        return new Token(lexeme, "MENOS");
      case "*":
        return new Token(lexeme, "POR");
      case "mod":
      case "%":
        return new Token(lexeme, "MOD");
      case "div":
      case "/":
        return new Token(lexeme, "DIV");
      case "++":
        return new Token(lexeme, "INC");
      case "--":
        return new Token(lexeme, "DEC");
      case "return":
        return new Token(lexeme, "RETURN");
      case "=":
        return new Token(lexeme, "OPREL,IGUAL");
      case "<":
        return new Token(lexeme, "OPREL,MEN");
      case ">":
        return new Token(lexeme, "OPREL,MAY");
      case "<=":
        return new Token(lexeme, "OPREL,MEI");
      case ">=":
        return new Token(lexeme, "OPREL,MAI");
      case "!=":
        return new Token(lexeme, "OPREL,DIS");
      case "string":
        return new Token(lexeme, "TIPO,STRING");
      case "boolean":
        return new Token(lexeme, "TIPO,BOOLEAN");
      case "int":
        return new Token(lexeme, "TIPO,INT");
      default:
        return null;
    }
  };

  const recognizeComplexToken = (lexeme, cinta) => {
    if (lexeme.startsWith("//")) {
      return new Token(lexeme, "COMENTARIO_LINEA");
    } else if (lexeme.startsWith("/*") && lexeme.endsWith("*/")) {
      return new Token(lexeme, "COMENTARIO_MULTILINEA");
    }

    if (lexeme.startsWith("//")) {
      return new Token(lexeme, "COMENTARIO_LINEA");
    } else if (lexeme.startsWith("/*")) {
      // Comentario multilínea no terminado en esta línea
      const closingIndex = cinta.lexemes.findIndex((l) => l.endsWith("*/"));

      if (closingIndex !== -1) {
        const multilineComment = cinta.lexemes
          .slice(cinta.currentIndex - 1, closingIndex + 1)
          .join(" ");

        cinta.currentIndex = closingIndex + 1;

        return new Token(multilineComment, "COMENTARIO_MULTILINEA");
      } else {
        // Error: Comentario multilínea no terminado
        const unfinishedMultilineComment = cinta.lexemes
          .slice(cinta.currentIndex - 1)
          .join(" ");

        cinta.currentIndex = cinta.lexemes.length;

        return new Token(unfinishedMultilineComment, "ERROR");
      }
    }

    return null;
  };

  const recognizeUnsignedNumber = (lexeme) => {
    if (/^\d+$/.test(lexeme)) {
      return new Token(lexeme, "NUM");
    }
    return null;
  };

  const recognizeIdentifier = (lexeme) => {
    if (/^[A-Za-z][A-Za-z0-9]*$/.test(lexeme)) {
      return new Token(lexeme, "ID");
    }
    return null;
  };

  const recognizeStringConstant = (lexeme) => {
    if (/^"([^"\\]|\\.)*"$/.test(lexeme)) {
      return new Token(lexeme, "STRINGctte");
    }
    return null;
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
        Analex - Analizador Léxico para GRM123
      </h1>
      <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>Autor: Marco Toledo</h3>
      <textarea
        rows="10"
        cols="50"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        style={{ marginBottom: "10px" }}
      ></textarea>
      <br />
      <button
        onClick={analyzeLexemes}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Analizar
      </button>
      <h2 style={{ fontSize: "20px", marginTop: "20px" }}>
        Tokens reconocidos:
      </h2>
      <ul style={{ listStyleType: "none", padding: "0" }}>
        {tokens.map((token, index) => (
          <li
            key={index}
            style={{
              fontFamily: "Courier New, monospace",
              fontSize: "16px",
              marginBottom: "5px",
            }}
          >
            {token.toString()}
          </li>
        ))}
      </ul>
    </div>
  );
  
}

export default AppLexema;
