import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import Footer from "../../components/layout/Footer";
import { MapPinIcon, XMarkIcon } from "@heroicons/react/24/solid";

const Checkout = () => {
  const navigate = useNavigate();

  const [cartItems] = useState([
    { id: 1, name: "Beras rojo lele 5kg", price: 70000, qty: 1 },
    { id: 2, name: "Beras rojo lele 5kg", price: 70000, qty: 1 },
  ]);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [showBankPopup, setShowBankPopup] = useState(false);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const handleOrder = () => {
    if (!paymentMethod)
      return alert("Silakan pilih metode pembayaran terlebih dahulu!");
    if (paymentMethod === "transfer" && !selectedBank)
      return alert("Silakan pilih bank terlebih dahulu!");

    navigate("/checkout-success");
  };

  return (
    <div className="bg-[#FFFEF6] min-h-screen font-poppins text-[#1E1E1E]">
      <NavbarAfterLogin />

      <div className="pt-24 px-8 lg:px-24 pb-12 space-y-10">

        {/* ✅ Tombol Kembali */}
        <button
          onClick={() => navigate(-1)}
          className="text-[#344E41] font-semibold hover:underline mb-4"
        >
          ← Kembali
        </button>

        {/* ALAMAT */}
        <div className="bg-[#D9D9D9] p-6 rounded-md relative shadow-sm">
          <div className="flex gap-3 items-start">
            <MapPinIcon className="w-6 h-6 text-[#E63946]" />
            <div>
              <p className="font-bold text-[16px]">Full Name</p>
              <p className="text-sm text-[#1E1E1E]">(+62)</p>
              <p className="text-sm text-[#1E1E1E] mt-2 leading-relaxed max-w-2xl">
                Alamat: Lorem ipsum dolor sit amet consectetur. Fermentum nunc
                nam neque facilisi rhoncus. Vestibulum dolor mi tristique nisi
                nullam mauris nunc nec duis.
              </p>
            </div>
          </div>

          <button className="absolute top-6 right-6 text-blue-700 font-medium text-sm hover:underline">
            Ubah
          </button>
        </div>

        {/* PRODUK DIPESAN */}
        <div className="bg-[#D9D9D9] p-6 rounded-md shadow-sm">
          <h2 className="font-bold text-[17px] mb-3">Produk Dipesan</h2>

          <div className="flex justify-between font-semibold text-sm border-b border-[#1E1E1E] pb-2 mb-3">
            <span className="w-1/2 pl-20">Harga Satuan</span>
            <span className="w-20 text-center">Jumlah</span>
            <span className="w-28 text-right">Subtotal</span>
          </div>

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center mb-4 text-sm"
            >
              <div className="flex gap-4 items-center w-1/2">
                <div className="w-20 h-20 bg-gray-300 rounded-md"></div>
                <p className="font-semibold">{item.name}</p>
              </div>
              <p className="w-20 text-center">Rp {item.price.toLocaleString()}</p>
              <p className="w-20 text-center">{item.qty}</p>
              <p className="w-28 text-right font-semibold">
                Rp {(item.price * item.qty).toLocaleString()}
              </p>
            </div>
          ))}

          <div className="bg-[#BFBFBF] py-3 px-4 mt-6 rounded-md flex justify-between font-semibold">
            <span>Total Pesanan :</span>
            <span>Rp {totalPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* METODE PEMBAYARAN */}
        <div className="bg-[#D9D9D9] p-6 rounded-md shadow-sm">
          <h2 className="font-bold text-[17px] mb-6">
            Pilih Metode Pembayaran :
          </h2>

          {/* Pilihan Metode */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => {
                setPaymentMethod("cod");
                setShowBankPopup(false);
              }}
              className={`px-4 py-1 border-2 rounded-md text-sm font-semibold ${
                paymentMethod === "cod"
                  ? "bg-[#FFFFFF] border-[#1E1E1E]"
                  : "bg-[#EAEAEA] border-transparent"
              }`}
            >
              COD
            </button>
            <button
              onClick={() => {
                setPaymentMethod("transfer");
                setShowBankPopup(true);
              }}
              className={`px-4 py-1 border-2 rounded-md text-sm font-semibold ${
                paymentMethod === "transfer"
                  ? "bg-[#FFFFFF] border-[#1E1E1E]"
                  : "bg-[#EAEAEA] border-transparent"
              }`}
            >
              Transfer Bank
            </button>
          </div>

          {/* Tombol Buat Pesanan */}
          <div className="flex justify-end">
            <button
              onClick={handleOrder}
              className="bg-black text-white px-6 py-2 rounded-md font-semibold hover:bg-[#333] transition"
            >
              Buat Pesanan
            </button>
          </div>
        </div>
      </div>

      {/* ✅ POPUP PILIH BANK */}
      {showBankPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="relative bg-[#FFFEF6] p-8 rounded-xl shadow-lg w-[90%] max-w-[800px]">
            {/* Tombol X di pojok kanan atas */}
            <button
              onClick={() => setShowBankPopup(false)}
              className="absolute top-4 right-4 text-[#333] hover:text-black"
              aria-label="Tutup"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <h3 className="font-bold text-[18px] mb-6">Pilih Bank :</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8">
              {["BRI", "BCA", "BNI", "Mandiri", "Permata", "BSI"].map(
                (bank, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="bank"
                      checked={selectedBank === bank}
                      onChange={() => setSelectedBank(bank)}
                    />
                    <div className="w-20 h-10 bg-gray-300 rounded-md"></div>
                    <span className="text-sm font-medium">Bank {bank}</span>
                  </label>
                )
              )}
            </div>

            <div className="flex justify-between items-center mt-10">
              <p className="font-bold text-md">
                Total Pesanan : Rp {totalPrice.toLocaleString()}
              </p>

              <button
                onClick={() => {
                  setShowBankPopup(false);
                  handleOrder();
                }}
                className="bg-black text-white px-6 py-2 rounded-md font-semibold hover:bg-[#333] transition"
              >
                Buat Pesanan
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Checkout;