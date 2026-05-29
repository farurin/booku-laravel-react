import React, { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import BannerCorner from "../components/BannerCorner";
import CtaDownload from "../components/CtaDownload";

// Import Assets
import bannerBg from "../assets/tentangkami_banner.png";
import bannerIcon from "../assets/tentangkami_icon.png";
import logoImg from "../assets/logo-booku.png";
import kenapaKamiImg from "../assets/tentangkami_kenapakami.png";
import donateBtnImg from "../assets/donate.png";

const About = () => {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-booku-cream min-h-screen">
      <BannerCorner
        title={t("about_heading")}
        bgImage={bannerBg}
        icon={bannerIcon}
      />

      <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-16 md:py-24 flex flex-col items-center text-center">
        <div className="bg-white p-6 md:p-8 rounded-[40px] shadow-sm border border-white mb-12">
          <img
            src={logoImg}
            alt="Dunia Dongeng Logo"
            className="w-48 md:w-64 object-contain"
          />
        </div>

        <div className="max-w-3xl flex flex-col gap-6 mb-16">
          <p className="text-gray-700 font-medium text-base md:text-lg leading-relaxed bg-white/50 p-6 rounded-3xl">
            {t("about_p1")}
          </p>
          <p className="text-gray-700 font-medium text-base md:text-lg leading-relaxed bg-white/50 p-6 rounded-3xl">
            {t("about_p2")}
          </p>
        </div>

        <div className="w-full max-w-4xl bg-booku-cyan/20 rounded-[48px] p-6 md:p-12 mb-16 border border-booku-cyan/50">
          <img
            src={kenapaKamiImg}
            alt="Kenapa Kami Hadir"
            className="w-full object-contain drop-shadow-xl transition-transform hover:scale-105 duration-500"
          />
        </div>

        <div className="max-w-3xl flex flex-col gap-6 mb-20">
          <p className="text-gray-700 font-medium text-base md:text-lg leading-relaxed bg-white/50 p-6 rounded-3xl">
            {t("about_p3")}
          </p>
          <p className="text-gray-700 font-medium text-base md:text-lg leading-relaxed bg-white/50 p-6 rounded-3xl">
            {t("about_p4")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-20">
          {[
            {
              text: t("about_fact1"),
              bg: "bg-booku-cyan text-gray-900 border-white",
            },
            {
              text: t("about_fact2"),
              bg: "bg-booku-coral text-white border-white",
            },
            {
              text: t("about_fact3"),
              bg: "bg-booku-yellow text-gray-900 border-white",
            },
          ].map((item, index) => {
            const parts = item.text.split(" (");
            return (
              <div
                key={index}
                className={`${item.bg} border-4 rounded-[32px] p-8 flex flex-col items-center justify-center shadow-md hover:-translate-y-2 transition-transform`}
              >
                <p className="text-lg md:text-xl font-bold leading-snug">
                  {parts[0]}
                  {parts[1] && (
                    <>
                      <br />
                      <span className="font-black opacity-80 mt-2 block tracking-widest uppercase text-sm">
                        ({parts[1]}
                      </span>
                    </>
                  )}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-gray-100 w-full max-w-3xl mb-12">
          <p className="text-gray-900 text-xl md:text-2xl font-black leading-relaxed">
            {t("about_closing")}
          </p>
        </div>

        <div className="mb-8">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block transition-transform hover:scale-105 active:scale-95"
          >
            <img
              src={donateBtnImg}
              alt="Donate Us"
              className="w-full max-w-sm md:max-w-md object-contain drop-shadow-xl"
            />
          </a>
        </div>
      </div>

      <CtaDownload />
    </div>
  );
};

export default About;
