import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import GradeNFT from "./contracts/GradeNFT.json";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaGraduationCap, FaClipboardList } from 'react-icons/fa';
// import './output.css';
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [lesson, setlesson] = useState("");
  const [student, setstudent] = useState("");
  const [studentnumber, setstudentnumber] = useState("");
  const [grade, setgrade] = useState("");
  const [gradesystems, setgradesystems] = useState([]);


  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        const contractInstance = new ethers.Contract(
          contractAddress,
          GradeNFT.abi,
          signer
        );
        setContract(contractInstance);
      } else {
        alert("Lütfen MetaMask kurun!");
      }
    };
    init();
  }, []);


  const issueGradeSystem = async () => {
    if (contract && lesson && student && grade && studentnumber) {
      const tx = await contract.issueGradeSystem(lesson, student, grade, studentnumber);
      await tx.wait();

      alert("Not Başarıyla Eklendi!");
      setlesson("");
      setstudent("");
      setstudentnumber("");
      setgrade("");
    }
  };


  const fetchGradeSystem = async () => {
    if (contract) {
      const ids = await contract.getUserGradeSystem(account);
      const data = await Promise.all(
        ids.map(async (id) => {
          const cert = await contract.getGradeSystemDetails(id);
          return {
            id: id.toString(),
            lesson: cert.lesson,
            student: cert.student,
            grade: cert.grade,
            studentnumber: cert.studentnumber,
            issueDate: new Date(Number(cert.issueDate) * 1000).toLocaleString(),
          };
        })
      );
      setgradesystems(data);
    }
  };
  const handleGradeChange = (e) => {
    // Sadece sayıları kabul et
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      const numericValue = parseInt(value, 10);

      if (value === "") {
        setgrade("");
      } else if (numericValue >= 0 && numericValue <= 100) {
        setgrade(value);
      }
    }
  };
  const handleStudentNumberChange = (e) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      const numericValue = parseInt(value, 10);

      if (value === "") {
        setstudentnumber("");
      } else if (numericValue >= 0 && numericValue <= 999999) {
        setstudentnumber(value);
      }
    }
  };


  return (

    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <div className="card-body">
          <h2 className="text-center mb-4">Hoş geldin, {account}</h2>

          <div className="form-group mt-1">
            <label htmlFor="studentName">Öğrenci Adı</label>
            <input
              type="text"
              className="form-control"
              id="studentName"
              placeholder="Öğrenci Adı Gir"
              value={student}
              onChange={(e) => setstudent(e.target.value)}
            />
          </div>

          <div className="form-group mt-1">
            <label htmlFor="studentNumber">Öğrenci Numarası</label>
            <input
              type="text"
              className="form-control"
              id="studentNumber"
              placeholder="Öğrenci Numarası Gir"

              value={studentnumber}
              onChange={handleStudentNumberChange}

            />
          </div>

          <div className="form-group mt-1">
            <label htmlFor="lessonName">Ders Adı</label>
            <input
              type="text"
              className="form-control"
              id="lessonName"
              placeholder="Ders Adı Gir"
              value={lesson}
              onChange={(e) => setlesson(e.target.value)}
            />
          </div>

          <div className="form-group mt-1">
            <label htmlFor="grade">Ders Notu</label>
            <input
              type="text"

              className="form-control"
              id="grade"
              placeholder="Ders Notu Gir"
              value={grade}
              onChange={handleGradeChange}
            />
          </div>

          <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-success btn-lg"
              onClick={issueGradeSystem}
            >
              <FaGraduationCap className="mr-2" />
              Ders Notu Ver
            </button>
            <button
              className="btn btn-info btn-lg"
              onClick={fetchGradeSystem}
            >
              <FaClipboardList className="mr-2" />
              Ders Notu Göster
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-center">Notlar</h3>
        <ul className="list-group">
          {gradesystems.map((cert) => (
            <li key={cert.id} className="list-group-item list-group-item-info">
              Öğrenci Adı: <strong>{cert.student}</strong> - Ders Adı: <strong> {cert.lesson}</strong> - Ders Notu: <strong> {cert.grade} </strong> - Tarih: <strong> {cert.issueDate}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>

    // <div style={{ padding: "20px" }}>
    //   <h2>Hoş geldin, {account}</h2>
    //   <input
    //     type="text"
    //     placeholder="Öğrenci Adı Gir"
    //     value={student}
    //     onChange={(e) => setstudent(e.target.value)}
    //   />
    //   <input
    //     type="text"
    //     placeholder="Öğrenci Numarası Gir"
    //     value={studentnumber}
    //     onChange={(e) => setstudentnumber(e.target.value)}
    //   />
    //   <input
    //     type="text"
    //     placeholder="Ders Adı Gir"
    //     value={lesson}
    //     onChange={(e) => setlesson(e.target.value)}
    //   />
    //   <input
    //     type="text"
    //     placeholder="Ders Notu Gir"
    //     value={grade}
    //     onChange={(e) => setgrade(e.target.value)}
    //   />
    //   <button onClick={issueGradeSystem}>Ders Notu Ver</button>
    //   <br />
    //   <button onClick={fetchGradeSystem}>Ders Notu Göster</button>


    //   <ul>
    //     {gradesystems.map((cert) => (
    //       <li key={cert.id}>
    //         # {cert.id} - {cert.student} -{cert.studentnumber} -{cert.lesson}-{cert.grade}- {cert.issueDate}
    //       </li>
    //     ))}
    //   </ul>
    // </div>
  );
}


export default App;
