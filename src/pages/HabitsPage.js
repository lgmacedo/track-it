import Header from "../components/Header";
import Menu from "../components/Menu";

import trash from "../assets/trash.png";

import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import axios from "axios";

import Usuario from "../globals/Usuario";

export default function HabitsPage() {
  const [usuario, setUsuario] = useContext(Usuario);
  const [habitos, setHabitos] = useState([]);

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${usuario.token}`,
      },
    };
    const promise = axios.get(
      "https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits",
      config
    );
    promise.then((res) => setHabitos(res.data));
  }, [habitos]);

  const [nomeHabito, setNomeHabito] = useState("");
  const [dias, setDias] = useState([
    { nome: "D", dia: 0, selecionado: false },
    { nome: "S", dia: 1, selecionado: false },
    { nome: "T", dia: 2, selecionado: false },
    { nome: "Q", dia: 3, selecionado: false },
    { nome: "Q", dia: 4, selecionado: false },
    { nome: "S", dia: 5, selecionado: false },
    { nome: "S", dia: 6, selecionado: false },
  ]);
  const [diasSelecionados, setDiasSelecionados] = useState([]);

  const [newHabitOpen, setNewHabitOpen] = useState(false);
  const [desabilitado, setDesabilitado] = useState(false);

  function openNewHabit() {
    if (newHabitOpen === true) return;
    setNewHabitOpen(true);
  }

  function clickDia(dia) {
    if (diasSelecionados.includes(dia)) {
      let newDias = [...dias];
      newDias[dia].selecionado = false;
      setDias([...newDias]);
      const index = diasSelecionados.indexOf(dia);
      const newDiasSelecionados = diasSelecionados
        .slice(0, index)
        .concat(diasSelecionados.slice(index + 1))
        .sort();
      setDiasSelecionados(newDiasSelecionados);
      return;
    }
    let newDias = [...dias];
    newDias[dia].selecionado = true;
    setDias([...newDias]);
    const newDiasSelecionados = [...diasSelecionados, dia].sort();
    setDiasSelecionados(newDiasSelecionados);
  }

  function novoHabito(e) {
    e.preventDefault();
    if (diasSelecionados.length === 0) {
      alert("Escolha pelo menos um dia da semana");
      return;
    }
    setDesabilitado(true);
    const habito = { name: nomeHabito, days: diasSelecionados };
    const config = {
      headers: {
        Authorization: `Bearer ${usuario.token}`,
      },
    };
    const promise = axios.post(
      "https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits",
      habito,
      config
    );
    promise.then(novoHabitoSuccess);
    promise.catch(novoHabitoFailed);
  }

  function novoHabitoSuccess() {
    setNomeHabito("");
    setDias([
      { nome: "D", dia: 0, selecionado: false },
      { nome: "S", dia: 1, selecionado: false },
      { nome: "T", dia: 2, selecionado: false },
      { nome: "Q", dia: 3, selecionado: false },
      { nome: "Q", dia: 4, selecionado: false },
      { nome: "S", dia: 5, selecionado: false },
      { nome: "S", dia: 6, selecionado: false },
    ]);
    setDiasSelecionados([]);
    setDesabilitado(false);
    setNewHabitOpen(false);
    setHabitos(habitos);
  }

  function novoHabitoFailed() {
    setDesabilitado(false);
    alert("Erro na requisição do servidor");
  }

  function deleteHabit(id) {
    const resposta = window.confirm("Deseja mesmo apagar esse hábito?");
    if (resposta !== true) return;
    const config = {
      headers: {
        Authorization: `Bearer ${usuario.token}`,
      },
    };
    const promise = axios.delete(
      `https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits/${id}`,
      config
    );
    promise.then(() => setHabitos(habitos));
  }

  return (
    <>
      <Header />
      <HabitsContainer>
        <HabitsTitle>
          <p>Meus hábitos</p>
          <button onClick={openNewHabit}>+</button>
        </HabitsTitle>
        <AddHabit newHabitOpen={newHabitOpen} desabilitado={desabilitado}>
          <form onSubmit={novoHabito}>
            <input
              disabled={desabilitado ? true : false}
              required
              value={nomeHabito}
              onChange={(e) => setNomeHabito(e.target.value)}
              placeholder="nome do hábito"
              maxLength="20"
            />
            <Dias>
              {dias.map((d) => (
                <BotaoDia
                  disabled={desabilitado ? true : false}
                  key={d.dia}
                  selecionado={d.selecionado}
                  desabilitado={desabilitado}
                  onClick={() => clickDia(d.dia)}
                  type="button"
                >
                  {d.nome}
                </BotaoDia>
              ))}
            </Dias>
            <Botoes desabilitado={desabilitado}>
              <button
                onClick={() => setNewHabitOpen(false)}
                disabled={desabilitado ? true : false}
                type="button"
              >
                Cancelar
              </button>
              <button disabled={desabilitado ? true : false} type="submit">
                <p>Salvar</p>
                <ThreeDots
                  height="13"
                  width="51"
                  radius="9"
                  color="#ffffff"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClassName=""
                  visible={desabilitado}
                />
              </button>
            </Botoes>
          </form>
        </AddHabit>
        {habitos.map((h) => (
          <Habit key={h.id}>
            <p>{h.name}</p>
            <Dias>
              {dias.map((d) => (
                <BotaoDia
                  disabled={true}
                  key={d.dia}
                  selecionado={h.days.includes(d.dia)}
                  desabilitado={true}
                  type="button"
                >
                  {d.nome}
                </BotaoDia>
              ))}
            </Dias>
            <img
              onClick={() => deleteHabit(h.id)}
              src={trash}
              alt="trash-bin"
            />
          </Habit>
        ))}
        <NoHabits show={habitos.length === 0}>
          Você não tem nenhum hábito cadastrado ainda. Adicione um hábito para
          começar a trackear!
        </NoHabits>
      </HabitsContainer>
      <Menu />
    </>
  );
}

const HabitsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 70px;
  padding-bottom: 110px;
`;

const HabitsTitle = styled.div`
  margin-top: 28px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  p {
    margin-left: 17px;
    font-weight: 400;
    font-size: 22.976px;
    line-height: 29px;
    color: #126ba5;
  }
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-right: 18px;
    width: 40px;
    height: 35px;
    background: #52b6ff;
    border-radius: 4.63636px;
    border: none;
    color: white;
    font-weight: 400;
    font-size: 26.976px;
    line-height: 34px;
  }
`;

const AddHabit = styled.div`
  display: ${({ newHabitOpen }) => (newHabitOpen ? "flex" : "none")};
  flex-direction: column;
  background-color: #ffffff;
  width: 90.67%;
  height: 180px;
  margin: 0 auto;
  border-radius: 5px;
  margin-bottom: 10px;
  form {
    display: flex;
    flex-direction: column;
    input {
      width: 89.11%;
      height: 45px;
      background: ${({ desabilitado }) =>
        desabilitado ? "#f2f2f2" : "#ffffff"};
      border: 1px solid #d5d5d5;
      border-radius: 5px;
      margin: 18px auto 0;
      font-family: "Lexend Deca";
      font-style: normal;
      font-weight: 400;
      font-size: 19.976px;
      line-height: 25px;
      padding-left: 11px;
      color: ${({ desabilitado }) => (desabilitado ? "#b3b3b3" : "#666666")};
      &::placeholder {
        color: #dbdbdb;
      }
    }
    button {
      font-family: "Lexend Deca";
      font-style: normal;
      font-weight: 400;
    }
  }
`;

const Dias = styled.div`
  margin-top: 8px;
  margin-left: 11px;
`;

const BotaoDia = styled.button`
  margin-right: 4px;
  width: 30px;
  height: 30px;
  background: ${({ selecionado }) => (selecionado ? "#cfcfcf" : "#ffffff")};
  border: 1px solid #d5d5d5;
  border-radius: 5px;
  font-size: 19.976px;
  line-height: 25px;
  cursor: ${({ desabilitado }) => (desabilitado ? "" : "pointer")};
  color: ${({ selecionado }) => (selecionado ? "#ffffff" : "#dbdbdb")};
`;

const Botoes = styled.div`
  margin-top: 29px;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  column-gap: 15px;
  button:nth-child(1) {
    width: 84px;
    height: 35px;
    background: none;
    border-radius: 4.63636px;
    border: none;
    color: #52b6ff;
    font-weight: 400;
    font-size: 15.976px;
    line-height: 20px;
    opacity: ${({ desabilitado }) => (desabilitado ? 0.7 : 1)};
    cursor: ${({ desabilitado }) => (desabilitado ? "" : "pointer")};
  }
  button:nth-child(2) {
    p {
      display: ${({ desabilitado }) => (desabilitado ? "none" : "")};
    }
    display: flex;
    justify-content: center;
    align-items: center;
    width: 84px;
    height: 35px;
    background: #52b6ff;
    border-radius: 4.63636px;
    border: none;
    color: white;
    font-weight: 400;
    font-size: 15.976px;
    line-height: 20px;
    opacity: ${({ desabilitado }) => (desabilitado ? 0.7 : 1)};
    cursor: ${({ desabilitado }) => (desabilitado ? "" : "pointer")};
  }
`;

const Habit = styled.div`
  width: 90.67%;
  height: 91px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 5px;
  position: relative;
  margin-bottom: 10px;
  overflow: hidden;
  p {
    font-style: normal;
    font-weight: 400;
    font-size: 19.976px;
    line-height: 25px;
    color: #666666;
    margin-top: 13px;
    margin-left: 11px;
  }
  img {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
  }
`;

const NoHabits = styled.p`
  display: ${({ show }) => (show ? "flex" : "none")};
  width: 90.67%;
  height: 74px;
  margin: 0 auto;
  font-weight: 400;
  font-size: 17.976px;
  line-height: 22px;
  color: #666666;
`;