import Header from "./components/Header";
import AnimatedRoutes from "./components/AnimatedRoutes";

function App() {
  const personalDetails = {
    name: "MOUAD FIFEL",
    location: "Agdal, RABAT",
    email: "mouad.fifel5@gmail.com",
    availability: "Open for work",
    brand:
    "I graduated with a Bachelor's degree in Mathematics and Computer Science from Multidisciplinary Faculty of Ouarzazate. I completed two years of training at YouCode School and recently finished an end-of-studies internship at Cegedim Morocco. I'm open to new opportunities as a full-stack developer, whether it's an internship, freelance work, or a full-time position.",
  };

  return (
    <>
      <Header />
      <AnimatedRoutes personalDetails={personalDetails} />
    </>
  );
}

export default App;
