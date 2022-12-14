import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import NumberFormat from "react-number-format";
import apiLivros from "../../../../../services/apiLivros";
import { toast } from "react-toastify";
import Spinner from "../../../../../layoult/components/Spinner";

const Registro = ({ dadosRegistro, onEdit }) => {
  const [habilitarInput, sethabilitarInput] = useState(false);
  const [edited, setEdited] = useState(false);

  const [emEstoque, setEmEstoque] = useState(dadosRegistro.emEstoque);
  const [vendidos, setVendidos] = useState(dadosRegistro.vendidos);

  const [detalheLivro, setDetalheLivro] = useState({});

  const [loading, setLoading] = useState(true);

  const { roles } = useSelector((state) => state);

  const preencheDetalhamentoLivro = useCallback(async () => {
    setLoading(true);
    
    await apiLivros
      .get(`livros/${dadosRegistro.idLivro}`)
      .then((response) => {
        setDetalheLivro(response.data);
        setLoading(false);
      })
      .catch((err) => {
        let mensagemErro = "Ocorreu um erro ao buscar os dados do livro ";
        console.log(mensagemErro + err);
        toast.success(mensagemErro, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setLoading(false);
      });
  }, [dadosRegistro]);

  useEffect(() => {
    preencheDetalhamentoLivro();
  }, [preencheDetalhamentoLivro]);

  function clickEditHandler() {
    if (!habilitarInput) {
      setEdited(false);
      sethabilitarInput(true);
    } else {
      sethabilitarInput(false);
      if (edited) {
        dadosRegistro.emEstoque = emEstoque;
        dadosRegistro.vendidos = vendidos;

        onEdit(dadosRegistro);
        setEdited(false);
      }
    }
  }

  function changeValueHandler() {
    setEdited(true);
  }

  return (
    <tr>
      <th scope="row">{dadosRegistro.id}</th>
      <td>{loading ? <Spinner height="1rem" width="1rem" color="text-dark" /> : detalheLivro.titulo}</td>
      <td>
        {!habilitarInput ? (
          emEstoque
        ) : (
          <NumberFormat
            autoFocus
            type="text"
            className="form-control"
            allowNegative={false}
            placeholder="0"
            defaultValue={emEstoque}
            onChange={(e) => {
              changeValueHandler();
              setEmEstoque(e.target.value);
            }}
          />
        )}
      </td>
      <td>
        {!habilitarInput ? (
          vendidos
        ) : (
          <NumberFormat
            type="text"
            className="form-control"
            allowNegative={false}
            placeholder="0"
            defaultValue={vendidos}
            onChange={(e) => {
              changeValueHandler();
              setVendidos(e.target.value);
            }}
          />
        )}
      </td>
      <td>{emEstoque > 0 ? "DISPONIVEL" : "INDISPONIVEL"}</td>
      {roles.some((item) => item === "ROLE_ADMIN") && (
        <td>
          <button
            onClick={clickEditHandler}
            className="btn btn-link"
            data-bs-toggle={edited && "modal"}
            data-bs-target="#alertModal"
          >
            <i
              style={{ color: "black" }}
              title="Editar"
              className="oi oi-pencil"
            ></i>
          </button>
        </td>
      )}
      <td>
        <Link
          to={`/detalhamento-livro/${detalheLivro.id}`}
          className="btn btn-link"
        >
          <i
            className="oi oi-folder"
            style={{ color: "black" }}
            title="Detalhar"
          ></i>
        </Link>
      </td>
    </tr>
  );
};

export default Registro;
