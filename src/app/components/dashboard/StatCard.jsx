"use client";
import React from "react";
import Link from "next/link";
import { MdArrowForwardIos } from "react-icons/md";

const StatCard = ({ title, total, Icon, detailLink, bgColor = "bg-white" }) => {
  return (
    <div
      className={`rounded-lg ${bgColor} shadow hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center`}
    >
      {/* Ikon dalam lingkaran */}
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow mb-4">
        <Icon className="text-gray-600" size={28} />
      </div>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 my-2">{total}</p>
      <Link
        href={detailLink}
        className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors group"
      >
        Detail
        <MdArrowForwardIos
          className="ml-1 transition-transform duration-300 group-hover:translate-x-1"
          size={16}
        />
      </Link>
    </div>
  );
};

export default StatCard;
