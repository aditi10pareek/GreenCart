import "../styles/style.css";

// Import images
import organic from "../assets/images/organic.jpg";
import cleaning from "../assets/images/cleaning.jpg";
import personal from "../assets/images/personal.jpg";
import bottles from "../assets/images/bottles.png";
import fashion from "../assets/images/fashion.jpg";
import pet from "../assets/images/pet.jpg";

function CategorySection() {

  const categories = [
    { img: organic, title: "Grocery & Organic Food", desc: "Organic and Fresh Food Items" },
    { img: cleaning, title: "Cleaning & Household", desc: "Non-toxic home cleaners" },
    { img: personal, title: "Personal Care & Hygiene", desc: "Chemical-free beauty" },
    { img: bottles, title: "Kitchen & Reusable Products", desc: "Reusable kitchen products" },
    { img: fashion, title: "Clothing & Fashion", desc: "Eco-friendly fashion" },
    { img: pet, title: "Pet Care", desc: "Eco-friendly and Healthy Pet Products" }
  ];

  return (
    <section className="category-section" id="categories">
      <h2 className="category-title"><b>Product Categories</b></h2>
      <p className="category-subtitle">
        Explore product categories and don't forget to make greener choices every day.
      </p>

      <div className="category-grid">
        {categories.map((item, index) => (
          <div className="category-card" key={index}>
            <img src={item.img} alt={item.title} className="category-image" />
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CategorySection;