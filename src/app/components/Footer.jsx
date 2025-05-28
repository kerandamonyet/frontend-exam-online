import React from "react";

const Footer = () => {
  return (
    <>
      {/* Footer */}
      <footer className="bg-blue-800 text-white py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">SiapUjian</h3>
              <p className="text-blue-200">
                Platform belajar online yang menyenangkan untuk anak-anak SD.
              </p>
              <div className="flex mt-4 space-x-2">
                {["📱", "💻", "📚", "🎮"].map((icon, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-xl hover:bg-blue-600 cursor-pointer"
                  >
                    {icon}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Menu</h3>
              <ul className="space-y-2">
                {["Beranda", "Tentang Kami"].map((item, i) => (
                  <li key={i}>
                    <a
                      href="/"
                      className="text-blue-200 hover:text-white transition"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Hubungi Kami</h3>
              <p className="text-blue-200 mb-2">
                SDN 1 Cijoho
                <br />
                Jl. Re. Martadinata No.166
                <br />
                Kelurahan Cijoho
                <br />
                Kecamatan Kuningan
                <br />
                Kabupaten Kuningan
              </p>
              <p className="text-blue-200">Email: info@siapujian.com</p>
            </div>
          </div>

          <div className="border-t border-blue-700 mt-8 pt-6 text-center text-blue-200">
            <p>
              © 2025 SiapUjian. Dibuat dengan ❤️ untuk anak-anak SDN 1 Cijoho
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
