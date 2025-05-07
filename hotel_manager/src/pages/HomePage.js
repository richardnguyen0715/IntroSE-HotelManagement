import Header from "../components/Header"
import FeatureCard from "../components/FeatureCard"
import "../styles/HomePage.css"

import CatalogueImage from "../assets/Catalogue.png";
import ListImage from "../assets/List.png";
import FindImage from "../assets/Find.png";
import ReceiptImage from "../assets/Receipt.png";
import ReportImage from "../assets/Report.png";
import RegulationImage from "../assets/Regulation.png";

const HomePage = () => {
  const features = [
    {
      id: 1,
      imageSrc: CatalogueImage, 
      title: "LẬP DANH MỤC THUÊ PHÒNG",
      path: "/room-catalog",
    },
    {
      id: 2,
      imageSrc: ListImage, 
      title: "LẬP PHIẾU THUÊ PHÒNG",
      path: "/room-rental",
    },
    {
      id: 3,
      imageSrc: FindImage, 
      title: "TRA CỨU PHÒNG",
      path: "/room-search",
    },
    {
      id: 4,
      imageSrc: ReceiptImage, 
      title: "LẬP HÓA ĐƠN THANH TOÁN",
      path: "/invoice",
    },
    {
      id: 5,
      imageSrc: ReportImage, 
      title: "LẬP BÁO CÁO THÁNG",
      path: "/monthly-report",
    },
    {
      id: 6,
      imageSrc: RegulationImage, 
      title: "THAY ĐỔI QUY ĐỊNH",
      path: "/regulations",
    },
  ]

  return (
    <div className="home-container">
      <Header />
      <main className="main-content">
        <h1 className="page-title">Trang chủ</h1>
        <div className="feature-grid">
          {features.map((feature) => (
            <FeatureCard key={feature.id} imageSrc={feature.imageSrc} title={feature.title} path={feature.path} />
          ))}
        </div>
      </main>
    </div>
  )
}

export default HomePage