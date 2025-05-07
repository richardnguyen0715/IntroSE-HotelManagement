import { Link } from "react-router-dom"
import "../styles/FeatureCard.css"

const FeatureCard = ({ imageSrc, title, path }) => {
  return (
    <Link to={path} className="feature-card">
      <div className="icon-container">
        <img src={imageSrc} alt={title} className="feature-icon" />
      </div>
      <h3 className="feature-title">{title}</h3>
    </Link>
  )
}

export default FeatureCard