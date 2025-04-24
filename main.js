// Mengimpor modul Firebase yang dibutuhkan
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore, // Untuk mengakses database Firestore
  collection,   // Untuk mengakses koleksi data
  addDoc,       // Untuk menambahkan dokumen baru
  getDoc,       // Untuk mengambil dokumen tunggal berdasarkan ID
  getDocs,      // Untuk mengambil banyak dokumen
  deleteDoc,    // Untuk menghapus dokumen
  doc,          // Untuk mengakses dokumen tertentu berdasarkan ID
  query,        // Untuk membuat query pencarian dokumen
  orderBy,      // Untuk mengurutkan dokumen berdasarkan field tertentu
  updateDoc     // Untuk memperbarui dokumen
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Konfigurasi Firebase yang diberikan oleh Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCksetmQe_ec2BH6g5MKqQU_1K1U6htmww", // API key yang digunakan untuk autentikasi
  authDomain: "data-7d32f.firebaseapp.com", // Domain untuk autentikasi
  projectId: "data-7d32f", // ID proyek Firebase
  storageBucket: "data-7d32f.appspot.com", // Bucket penyimpanan Firebase
  messagingSenderId: "156748846014", // ID pengirim untuk notifikasi
  appId: "1:156748846014:web:4269883b14bdb400b2dfef", // ID aplikasi untuk Firebase
  measurementId: "G-W3SBB85TF1" // ID untuk pengukuran analitik
};

// Inisialisasi aplikasi Firebase menggunakan konfigurasi di atas
const app = initializeApp(firebaseConfig);

// Mendapatkan referensi ke Firestore
const db = getFirestore(app);

// Fungsi untuk mengambil semua tugas dari koleksi "senin" dan mengurutkannya berdasarkan nama tugas
export async function ambildaftartugas() {
  // Mendapatkan referensi ke koleksi "senin"
  const refDokumen = collection(db, "senin");
  
  // Membuat query untuk mengurutkan dokumen berdasarkan field "tugas"
  const kueri = query(refDokumen, orderBy("tugas"));
  
  // Mengambil dokumen sesuai query
  const cuplikankueri = await getDocs(kueri);

  let hasil = [];
  
  // Mengonversi hasil query menjadi array tugas
  cuplikankueri.forEach((dok) => {
    hasil.push({
      id: dok.id, // ID dokumen
      tugas: dok.data().tugas, // Data tugas
      status: dok.data().status, // Status tugas
      prioritas: dok.data().prioritas, // Prioritas tugas
      tanggal: dok.data().tanggal, // Tanggal tugas
    });
  });

  // Mengembalikan hasil sebagai array
  return hasil;
}

// Fungsi untuk menambahkan tugas baru ke koleksi "senin"
export async function tambahtugas(tugas, status, prioritas, tanggal) {
  try {
    // Menambahkan dokumen baru ke koleksi "senin"
    const dokRef = await addDoc(collection(db, 'senin'), {
      tugas: tugas,
      status: status,
      prioritas: prioritas,
      tanggal: tanggal,
    });
    console.log('Berhasil menambah tugas ' + dokRef.id); // Menampilkan ID dokumen yang baru ditambahkan
  } catch (e) {
    console.log('Gagal menambah tugas ' + e); // Menangani error jika gagal menambah tugas
  }
}

// Fungsi untuk menghapus tugas berdasarkan ID
export async function hapustugas(docId) {
  // Menghapus dokumen dari koleksi "senin" menggunakan ID
  await deleteDoc(doc(db, "senin", docId));
}

// Fungsi untuk memperbarui seluruh isi tugas berdasarkan ID
export async function ubahtugas(docId, tugas, status, prioritas, tanggal) {
  // Memperbarui dokumen yang sesuai dengan ID
  await updateDoc(doc(db, "senin", docId), {
    tugas: tugas,
    status: status,
    prioritas: prioritas,
    tanggal: tanggal,
  });
}

// Fungsi untuk mengambil 1 tugas berdasarkan ID
export async function ambiltugas(docId) {
  // Mendapatkan referensi dokumen berdasarkan ID
  const docRef = await doc(db, "senin", docId);
  
  // Mengambil data dari dokumen tersebut
  const docSnap = await getDoc(docRef);
  
  // Mengembalikan data dokumen
  return await docSnap.data();
}

// Fungsi untuk mengubah status tugas (misalnya toggle antara "Selesai" dan "Belum Selesai")
export async function ubahstatus(docId, statusBaru) {
  // Memperbarui status tugas dengan status baru
  await updateDoc(doc(db, "senin", docId), {
    status: statusBaru,
  });
}

// Fungsi tambahan (opsional) untuk menghapus semua tugas dengan status "Sedang Dikerjakan"
export async function hapusSedangDikerjakan() {
  // Mendapatkan referensi koleksi "senin"
  const refDokumen = collection(db, "senin");
  
  // Mengambil semua dokumen dalam koleksi tersebut
  const kueri = query(refDokumen);
  const cuplikankueri = await getDocs(kueri);

  // Memeriksa setiap dokumen dan menghapus yang memiliki status "Sedang Dikerjakan"
  cuplikankueri.forEach(async (dok) => {
    if (dok.data().status === "Sedang Dikerjakan") {
      // Menghapus dokumen dengan status tersebut
      await deleteDoc(doc(db, "senin", dok.id));
      console.log(`Tugas "${dok.data().tugas}" dihapus (status: Sedang Dikerjakan).`);
    }
  });
}