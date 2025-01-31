import Image from "next/image";

export default function TentangKami() {
  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-between items-center bg-white lg:p-4 lg:px-20 lg:pb-32 lg:pt-20 md:py-12">
        <div className="mt-8 lg:mt-0 lg:w-1/2 flex justify-center">
          <Image
            src="/icon/tentang-kami.svg"
            alt="guru icon"
            width={50}
            height={50}
            priority
            className="w-3/4 max-w-md lg:max-w-full"
          />
        </div>
        <div className="flex flex-col lg:w-1/2 text-center lg:text-left md:mt-10 lp-5 mb-5 ">
          <p className="text-[14px] font-medium text-[#026EE8]">
            TENTANG KAMI - SiapUjian
          </p>
          <p className="text-[24px] lg:text-[32px] font-bold leading-8 lg:leading-10 text-[#026EE8] mt-2">
            Siap Ujian, Siap Pujian
          </p>
          <p className="text-[14px] font-medium text-[#000000] mt-5">
            Selamat datang di SiapUjian, platform inovatif yang dirancang khusus
            <br className="hidden lg:block" /> untuk membantu siswa Sekolah
            Dasar Negeri 1 Cijoho mempersiapkan diri <br className="hidden lg:block" />
            menghadapi Asesmen Nasional Berbasis Komputer (ANBK).
            <br className="hidden lg:block" />
            Kami percaya bahwa setiap anak memiliki potensi besar untuk sukses,{" "}
            <br className="hidden lg:block" />
            dan kami hadir untuk memastikan mereka mendapatkan pengalaman
            belajar yang menyenangkan, efektif, dan interaktif.
            <br className="hidden lg:block" />
          </p>
        </div>
      </div>
    </div>
  );
}
