import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO.firebaseapp.com",
  projectId: "SEU_PROJETO_ID",
  storageBucket: "SEU_BUCKET.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [form, setForm] = useState({ nome: '', id: '', valor: '', prazo: '' });
  const [invest, setInvest] = useState({ inicial: '', mensal: '', tempo: '', taxa: '' });
  const [resultado, setResultado] = useState(null);

  const enviarSolicitacao = async () => {
    if (!form.nome || !form.id || !form.valor || !form.prazo) return;
    try {
      await addDoc(collection(db, "solicitacoes"), form);
      alert("Solicitação enviada com sucesso!");
      setForm({ nome: '', id: '', valor: '', prazo: '' });
    } catch (e) {
      console.error("Erro:", e);
    }
  };

  const calcularInvestimento = () => {
    const P = parseFloat(invest.inicial);
    const PMT = parseFloat(invest.mensal);
    const n = parseInt(invest.tempo);
    const i = parseFloat(invest.taxa) / 100 / 12;
    if (isNaN(P) || isNaN(PMT) || isNaN(n) || isNaN(i)) return;
    const montante = P * Math.pow(1 + i, n) + PMT * ((Math.pow(1 + i, n) - 1) / i);
    setResultado(montante.toFixed(2));
  };

  return (
    <div style={{ padding: 20, color: '#fff', background: '#111', minHeight: '100vh' }}>
      <h1>Valiora — Invista. Cresça. Conquiste.</h1>
      <h2>Simulador de Investimento</h2>
      <input placeholder="Valor inicial" onChange={e => setInvest({ ...invest, inicial: e.target.value })} /><br/>
      <input placeholder="Aporte mensal" onChange={e => setInvest({ ...invest, mensal: e.target.value })} /><br/>
      <input placeholder="Tempo (meses)" onChange={e => setInvest({ ...invest, tempo: e.target.value })} /><br/>
      <input placeholder="Taxa (%)" onChange={e => setInvest({ ...invest, taxa: e.target.value })} /><br/>
      <button onClick={calcularInvestimento}>Calcular</button>
      {resultado && <p>Montante estimado: {resultado} Kz</p>}

      <h2>Microcrédito</h2>
      <input placeholder="Nome completo" onChange={e => setForm({ ...form, nome: e.target.value })} /><br/>
      <input placeholder="Nº Identificação" onChange={e => setForm({ ...form, id: e.target.value })} /><br/>
      <input placeholder="Valor desejado" onChange={e => setForm({ ...form, valor: e.target.value })} /><br/>
      <input placeholder="Prazo (meses)" onChange={e => setForm({ ...form, prazo: e.target.value })} /><br/>
      <button onClick={enviarSolicitacao}>Enviar solicitação</button>
    </div>
  );
}