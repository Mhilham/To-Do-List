import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCksetmQe_ec2BH6g5MKqQU_1K1U6htmww",
  authDomain: "data-7d32f.firebaseapp.com",
  projectId: "data-7d32f",
  storageBucket: "data-7d32f.appspot.com",
  messagingSenderId: "156748846014",
  appId: "1:156748846014:web:4269883b14bdb400b2dfef",
  measurementId: "G-W3SBB85TF1"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Ambil semua tugas dari koleksi "senin"
export async function ambildaftartugas() {
  const refDokumen = collection(db, "senin");
  const kueri = query(refDokumen, orderBy("tugas"));
  const cuplikankueri = await getDocs(kueri);

  let hasil = [];
  cuplikankueri.forEach((dok) => {
    hasil.push({
      id: dok.id,
      tugas: dok.data().tugas,
      status: dok.data().status,
      prioritas: dok.data().prioritas,
      tanggal: dok.data().tanggal,
    });
  });

  return hasil;
}

// Tambah tugas baru
export async function tambahtugas(tugas, status, prioritas, tanggal) {
  try {
    const dokRef = await addDoc(collection(db, 'senin'), {
      tugas: tugas,
      status: status,
      prioritas: prioritas,
      tanggal: tanggal,
    });
    console.log('Berhasil menambah tugas ' + dokRef.id);
  } catch (e) {
    console.log('Gagal menambah tugas ' + e);
  }
}

// Hapus tugas
export async function hapustugas(docId) {
  await deleteDoc(doc(db, "senin", docId));
}

// Ubah seluruh isi tugas
export async function ubahtugas(docId, tugas, status, prioritas, tanggal) {
  await updateDoc(doc(db, "senin", docId), {
    tugas: tugas,
    status: status,
    prioritas: prioritas,
    tanggal: tanggal,
  });
}

// Ambil 1 tugas berdasarkan ID
export async function ambiltugas(docId) {
  const docRef = await doc(db, "senin", docId);
  const docSnap = await getDoc(docRef);
  return await docSnap.data();
}

// Ubah hanya status tugas (toggle)
export async function ubahstatus(docId, statusBaru) {
  await updateDoc(doc(db, "senin", docId), {
    status: statusBaru,
  });
}

// Fungsi tambahan (opsional): Hapus semua tugas dengan status "Sedang Dikerjakan"
export async function hapusSedangDikerjakan() {
  const refDokumen = collection(db, "senin");
  const kueri = query(refDokumen);
  const cuplikankueri = await getDocs(kueri);

  cuplikankueri.forEach(async (dok) => {
    if (dok.data().status === "Sedang Dikerjakan") {
      await deleteDoc(doc(db, "senin", dok.id));
      console.log(`Tugas "${dok.data().tugas}" dihapus (status: Sedang Dikerjakan).`);
    }
  });
}