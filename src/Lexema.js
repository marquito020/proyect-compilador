import React, { useState } from "react";

// Clase Cinta
class Cinta {
  constructor(progFuente = "") {
    this.CR = 13; // Carry-Return
    this.LF = 10; // Line-Feed

    this.EOF = 0;
    this.EOLN = this.LF; // Usar salto de línea de Linux.

    this.celdas = progFuente;
    /* console.log(this.celdas); */
    this.cabezal = 0;

    this.fila = 0;
    this.col = 0;
    this.charAnt = this.EOF;
  }

  init() {
    this.cabezal = 0;
    this.fila = 0;
    this.col = 0;
    this.charAnt = this.EOF;
  }

  cc(offset) {
    const newPosition = this.cabezal + offset;
    /* console.log(this.celdas.celdas.charAt(newPosition)); */
    if (newPosition < this.celdas.celdas.length) {
      /* console.log(this.celdas.celdas.charAt(newPosition)); */
      return this.celdas.celdas.charAt(newPosition);
    }
    return this.EOF;
  }

  avanzar() {
    const c = this.cc(0);
    if (c === this.EOF) {
      throw new Error("No se puede avanzar más allá del EOF.");
    }

    if (this.charAnt === this.EOLN) {
      this.fila++;
      this.col = 0;
    }

    this.charAnt = c;
    this.forward();
    this.ignoreCR();
  }

  getFila() {
    return this.fila;
  }

  getColumna() {
    return this.col;
  }

  getPos() {
    return this.cabezal;
  }

  ignoreCR() {
    while (this.cc(0) === this.CR) {
      this.forward();
    }
  }

  forward() {
    this.cabezal++;
    this.col++;
  }
}

// Clase Token
class Token {
  static FIN = 0;
  static ERROR = 1;
  static MAIN = 2;
  static VOID = 3;
  static IF = 4;
  static ELSE = 5;
  static FOR = 6;
  static TO = 7;
  static WHILE = 8;
  static REPEAT = 9;
  static UNTIL = 10;
  static READLN = 11;
  static PRINT = 12;
  static PRINTLN = 13;
  static COMA = 14;
  static PTOCOMA = 15;
  static DOSPUNTOS = 16;
  static PA = 17;
  static PC = 18;
  static LA = 19;
  static LC = 20;
  static ASSIGN = 21;
  static NOT = 22;
  static AND = 23;
  static OR = 24;
  static FALSE = 25;
  static TRUE = 26;
  static MAS = 27;
  static MENOS = 28;
  static POR = 29;
  static MOD = 30;
  static DIV = 31;
  static INC = 32;
  static DEC = 33;
  static RETURN = 34;
  static NUM = 35;
  static ID = 36;
  static STRINGctte = 37;
  static OPREL = 38;
  static TIPO = 39;

  static IGUAL = 0;
  static MEN = 1;
  static MAY = 2;
  static MEI = 3;
  static MAI = 4;
  static DIS = 5;

  static STRING = -4;
  static BOOLEAN = -3;
  static INT = -2;

  constructor(nombre = Token.FIN, atributo = 0) {
    this.nom = nombre;
    this.atr = atributo;
  }

  set(nombre, atributo) {
    this.nom = nombre;
    this.atr = atributo;
  }

  setNom(nom) {
    this.nom = nom;
  }

  setAtr(atr) {
    this.atr = atr;
  }

  getNom() {
    return this.nom;
  }

  getAtr() {
    return this.atr;
  }

  toString() {
    return "<" + NOMtokenSTR[this.nom] + "," + this.atrToString(this.nom) + ">";
  }

  atrToString(nom) {
    if (Token.FIN <= nom && nom <= Token.RETURN) {
      return "_";
    }

    if (nom === Token.OPREL) {
      return OPRELstr[this.atr];
    }

    if (nom === Token.TIPO) {
      return TIPOstr[this.atr - Token.STRING];
    }

    return "" + this.atr;
  }

  get(v, i) {
    try {
      return v[i];
    } catch (e) {
      return DESCONOCIDO;
    }
  }
}

const DESCONOCIDO = "??";

const OPRELstr = ["IGUAL", "MEN", "MAY", "MEI", "MAI", "DIS"];
const TIPOstr = ["STRING", "BOOLEAN", "INT"];

const NOMtokenSTR = [
  "FIN",
  "ERROR",
  "MAIN",
  "VOID",
  "IF",
  "ELSE",
  "FOR",
  "TO",
  "WHILE",
  "REPEAT",
  "UNTIL",
  "READLN",
  "PRINT",
  "PRINTLN",
  "COMA",
  "PTOCOMA",
  "DOSPUNTOS",
  "PA",
  "PC",
  "LA",
  "LC",
  "ASSIGN",
  "NOT",
  "AND",
  "OR",
  "FALSE",
  "TRUE",
  "MAS",
  "MENOS",
  "POR",
  "MOD",
  "DIV",
  "INC",
  "DEC",
  "RETURN",
  "NUM",
  "ID",
  "STRINGctte",
  "OPREL",
  "TIPO",
];

// Clase Analex
class Analex {
  constructor(cinta) {
    this.M = new Cinta(cinta);
    this.R = new Token();
    this.ac = "";
    this.pos = 0;
  }

  init() {
    this.M.init();
    this.avanzar();
  }

  Preanalisis() {
    return this.R;
  }

  lexema() {
    return this.ac;
  }

  avanzar() {
    this.dt();
  }

  dt() {
    let estado = 0;
    this.ac = "";

    while (true) {
      const c = this.M.cc(0);
      switch (estado) {
        case 0:
          if (/\s/.test(c)) {
            this.M.avanzar();
            continue;
          } else if (c === this.M.EOF) {
            this.R.set(Token.FIN, -1);
            return;
          } else if (c === "/" && this.M.cc(1) === "/") {
            estado = 1;
            this.M.avanzar();
            this.M.avanzar();
            continue;
          } else if (c === "/" && this.M.cc(1) === "*") {
            estado = 2;
            this.M.avanzar();
            this.M.avanzar();
            continue;
          } else if (c === '"') {
            estado = 3;
            this.M.avanzar();
            continue;
          } else if (/[a-zA-Z_]/.test(c)) {
            estado = 4;
            this.ac += c;
            this.M.avanzar();
            continue;
          } else if (/[0-9]/.test(c)) {
            estado = 5;
            this.ac += c;
            this.M.avanzar();
            continue;
          } else if (c === "<") {
            estado = 6;
            this.ac += c;
            this.M.avanzar();
            continue;
          } else if (c === ">") {
            estado = 7;
            this.ac += c;
            this.M.avanzar();
            continue;
          } else if (c === "=") {
            this.ac += c;
            this.R.set(Token.OPREL, Token.IGUAL);
            this.M.avanzar();
            return;
          } else if (c === "!") {
            estado = 8;
            this.ac += c;
            this.M.avanzar();
            continue;
          } else if (c === "+") {
            estado = 10;
            this.ac += c;
            this.M.avanzar();
            continue;
          } else if (c === "-") {
            estado = 11;
            this.ac += c;
            this.M.avanzar();
            continue;
          } else if (c === "*") {
            this.ac += c;
            this.R.set(Token.POR, -1);
            this.M.avanzar();
            return;
          } else if (c === "%") {
            this.ac += c;
            this.R.set(Token.MOD, -1);
            this.M.avanzar();
            return;
          } else if (c === "/") {
            this.ac += c;
            this.R.set(Token.DIV, -1);
            this.M.avanzar();
            return;
          } else if (c === "(") {
            this.ac += c;
            this.R.set(Token.PA, -1);
            this.M.avanzar();
            return;
          } else if (c === ")") {
            this.ac += c;
            this.R.set(Token.PC, -1);
            this.M.avanzar();
            return;
          } else if (c === "{") {
            this.ac += c;
            this.R.set(Token.LA, -1);
            this.M.avanzar();
            return;
          } else if (c === "}") {
            this.ac += c;
            this.R.set(Token.LC, -1);
            this.M.avanzar();
            return;
          } else if (c === ",") {
            this.ac += c;
            this.R.set(Token.COMA, -1);
            this.M.avanzar();
            return;
          } else if (c === ";") {
            this.ac += c;
            this.R.set(Token.PTOCOMA, -1);
            this.M.avanzar();
            return;
          } else if (c === ":") {
            estado = 9;
            this.ac += c;
            this.M.avanzar();
            continue;
          } else if (c === "&") {
            this.ac += c;
            this.M.avanzar();
            this.R.set(Token.AND, -1);
            return;
          } else if (c === "|") {
            this.ac += c;
            this.M.avanzar();
            this.R.set(Token.OR, -1);
            return;
          } else if (c === "!") {
            this.ac += c;
            this.M.avanzar();
            this.R.set(Token.NOT, -1);
            return;
          }
          break;

        case 1: // Comentario de línea
          if (c === "\n" || c === this.M.EOF) {
            estado = 0;
          } else {
            this.M.avanzar();
          }
          continue;

        case 2: // Comentario multilínea
          if (c === "*" && this.M.cc(1) === "/") {
            estado = 1;
            this.M.avanzar();
            this.M.avanzar();
          } else {
            if (c === "\n" || c === this.M.EOF) {
              this.R.set(Token.ERROR, -1);
              return;
            } else {
              this.M.avanzar();
            }
          }
          continue;

        case 3: // Cadena de caracteres
          if (c === '"') {
            this.R.set(Token.STRINGctte, 0);
            this.M.avanzar();
            return;
          } else if (c === "\n" || c === this.M.EOF) {
            this.R.set(Token.ERROR, -1);
            return;
          } else {
            this.ac += c;
            this.M.avanzar();
          }
          continue;

        case 4: // Identificador
          if (/[a-zA-Z0-9_]/.test(c)) {
            this.ac += c;
            this.M.avanzar();
          } else {
            switch (this.ac) {
              case "main":
                this.R.set(Token.MAIN, -1);
                return;
              case "void":
                this.R.set(Token.VOID, -1);
                return;
              case "if":
                this.R.set(Token.IF, -1);
                return;
              case "else":
                this.R.set(Token.ELSE, -1);
                return;
              case "for":
                this.R.set(Token.FOR, -1);
                return;
              case "to":
                this.R.set(Token.TO, -1);
                return;
              case "while":
                this.R.set(Token.WHILE, -1);
                return;
              case "repeat":
                this.R.set(Token.REPEAT, -1);
                return;
              case "until":
                this.R.set(Token.UNTIL, -1);
                return;
              case "readln":
                this.R.set(Token.READLN, -1);
                return;
              case "print":
                this.R.set(Token.PRINT, -1);
                return;
              case "println":
                this.R.set(Token.PRINTLN, -1);
                return;
              case "not":
              case "!":
                this.R.set(Token.NOT, -1);
                return;
              case "and":
              case "&":
                this.R.set(Token.AND, -1);
                return;
              case "or":
              case "|":
                this.R.set(Token.OR, -1);
                return;
              case "false":
                this.R.set(Token.FALSE, -1);
                return;
              case "true":
                this.R.set(Token.TRUE, -1);
                return;
              case "return":
                this.R.set(Token.RETURN, -1);
                return;
              case "string":
                this.R.set(Token.TIPO, Token.STRING);
                return;
              case "boolean":
                this.R.set(Token.TIPO, Token.BOOLEAN);
                return;
              case "int":
                this.R.set(Token.TIPO, Token.INT);
                return;
              default:
                if (this.ac.match(/[a-zA-Z][a-zA-Z0-9]*/)) {
                  this.R.set(Token.ID, -1);
                  return;
                } else {
                  this.R.set(Token.ERROR, -1);
                  return;
                }
            }
          }
          continue;

        case 5: // Número entero
          if (/\d/.test(c)) {
            this.ac += c;
            this.M.avanzar();
          } else {
            this.R.set(Token.NUM, parseInt(this.ac));
            return;
          }
          continue;

        case 6: // Operadores relacionales: <
          if (c === "=") {
            this.ac += c;
            this.M.avanzar();
            this.R.set(Token.OPREL, Token.MEI);
            return;
          } else if (c === ">") {
            this.ac += c;
            this.M.avanzar();
            this.R.set(Token.OPREL, Token.DIS);
            return;
          } else {
            this.R.set(Token.OPREL, Token.MEN);
            return;
          }

        case 7: // Operadores relacionales: >
          if (c === "=") {
            this.ac += c;
            this.M.avanzar();
            this.R.set(Token.OPREL, Token.MAI);
            return;
          } else {
            this.R.set(Token.OPREL, Token.MAY);
            return;
          }

        case 8: // Operador relacional: !
          if (c === "=") {
            this.ac += c;
            this.M.avanzar();
            this.R.set(Token.OPREL, Token.DIS);
            return;
          } else {
            this.R.set(Token.NOT, -1);
            return;
          }

        case 9:
          if (c === "=") {
            this.ac += c;
            this.M.avanzar();
            this.R.set(Token.ASSIGN, -1);
            return;
          } else {
            this.R.set(Token.DOSPUNTOS, -1);
            return;
          }

        case 10:
          if (c === "+") {
            this.ac += c;
            this.M.avanzar();
            this.R.set(Token.INC, -1);
            return;
          } else {
            this.R.set(Token.MAS, -1);
            return;
          }

        case 11:
          if (c === "-") {
            this.ac += c;
            this.M.avanzar();
            this.R.set(Token.DEC, -1);
            return;
          } else {
            this.R.set(Token.MENOS, -1);
            return;
          }
      }
    }
  }
}

// Componente App
const Lexema = () => {
  const [programa, setPrograma] = useState("");
  const [tokens, setTokens] = useState([]);
  const [lexemas, setLexema] = useState([]);

  const analizarPrograma = () => {
    const lexemas = [];
    const cinta = new Cinta(programa + " ");
    const analex = new Analex(cinta);
    const tokens = [];
    analex.init();

    while (analex.Preanalisis().getNom() !== Token.FIN) {
      const token = analex.Preanalisis();
      const lexema = analex.lexema();
      console.log(token.toString());
      console.log(lexema);
      tokens.push(token.toString());
      lexemas.push(lexema);
      analex.avanzar();
    }

    setTokens(tokens);
    setLexema(lexemas);
  };

  return (
    <div className="lexema-container">
      <h1>ANALIZADOR LÉXICO PARA EL LENGUAJE GRM123</h1>
      <h2>Autor: Marco Toledo</h2>

      <textarea
        value={programa}
        onChange={(e) => setPrograma(e.target.value)}
        rows={10}
        cols={50}
        placeholder="Ingresa el programa..."
      ></textarea>
      <br />
      <button onClick={analizarPrograma}>Analizar</button>
      <br />
      <table>
        <thead>
          <tr>
            <th>Token</th>
            <th>Lexema</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token, index) => (
            <tr key={index}>
              <td>{token}</td>
              <td>{lexemas[index]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .lexema-container {
          width: 100%;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background-color: #f8f8f8;
        }

        h1 {
          margin-bottom: 10px;
        }

        h2 {
          margin-top: 0;
          margin-bottom: 20px;
          font-size: 1.2em;
          color: #555;
        }

        textarea {
          width: 100%;
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        button {
          padding: 10px 20px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          padding: 8px;
          border: 1px solid #ccc;
        }

        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default Lexema;

  