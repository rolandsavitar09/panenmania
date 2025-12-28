// src/pages/afterLogin/HomePageAfterLogin.js
import React, { useState, useEffect } from "react"; // Tambahkan hook
import { useNavigate } from "react-router-dom"; // Tambahkan useNavigate
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import Footer from "../../components/layout/Footer";
import HomeContent from "../../components/home/HomeContent";

// URL API yang terproteksi
const API_PROFILE_URL = "http://localhost:5000/api/auth/profile";

const HomePageAfterLogin = () => {
    const navigate = useNavigate();
    
    // State untuk manajemen otentikasi dan data
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- LOGIKA OTENTIKASI DAN FETCH DATA ---
    useEffect(() => {
        // 1. Ambil Token dari Local Storage
        const token = localStorage.getItem("token");

        if (!token) {
            // Jika TIDAK ada token, paksa user kembali ke halaman login
            navigate('/signin');
            return; // Hentikan eksekusi
        }

        const fetchProfile = async () => {
            try {
                const response = await fetch(API_PROFILE_URL, {
                    method: 'GET',
                    headers: {
                        // Mengirim Token JWT di header Authorization: Bearer <token>
                        'Authorization': `Bearer ${token}`, 
                        'Content-Type': 'application/json',
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    // 2. Token valid, dapatkan data user
                    // Data yang diterima adalah req.user dari backend (id, email, role)
                    setUserData(data.user);
                } else {
                    // 3. Token tidak valid/kadaluarsa (dapat status 401 dari backend)
                    // Paksa logout dan kembali ke login
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/signin');
                }
            } catch (err) {
                // Error koneksi jaringan
                setError("Gagal terhubung ke server backend.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]); // navigate ditambahkan ke dependency array

    // --- TAMPILAN CONDITIONAL ---

    if (loading) {
        // Tampilkan loading screen saat memverifikasi token
        return (
            <div className="bg-[#FFFEF6] min-h-screen flex justify-center items-center font-poppins">
                <p>Memverifikasi sesi dan memuat data...</p>
            </div>
        );
    }
    
    if (error) {
         // Tampilkan error koneksi
        return (
            <div className="bg-[#FFFEF6] min-h-screen flex flex-col justify-center items-center font-poppins">
                <p className="text-red-600">Terjadi kesalahan: {error}</p>
                <button 
                    onClick={() => navigate('/signin')}
                    className="mt-4 text-blue-500 underline"
                >
                    Kembali ke Login
                </button>
            </div>
        );
    }

    // Fungsi Logout Sederhana
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/signin');
    };

    // --- RENDER HALAMAN UTAMA JIKA OTENTIKASI BERHASIL ---
    return (
        // tambahkan padding-top sesuai tinggi navbar fixed
        <div className="bg-[#FFFEF6] min-h-screen font-poppins flex flex-col pt-16 md:pt-20">
            <NavbarAfterLogin userData={userData} handleLogout={handleLogout} /> {/* Pass data ke Navbar jika perlu */}

            {/* isLoggedIn = true untuk versi after login */}
            <HomeContent isLoggedIn={true} />
            
            {/* Contoh data user yang sudah diverifikasi: */}
            {/* <div className="p-4">
                <p className="text-xs text-gray-500">Anda login sebagai: {userData?.email} ({userData?.role})</p>
                <button onClick={handleLogout} className="text-red-500 underline text-sm">Logout Sekarang</button>
            </div> */}

            <Footer />
        </div>
    );
};

export default HomePageAfterLogin;