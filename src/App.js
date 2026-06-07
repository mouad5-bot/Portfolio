import Header from "./components/Header";
import AnimatedRoutes from "./components/AnimatedRoutes";

function App() {
  const personalDetails = {
    name: "MOUAD FIFEL",
    location: "Agadir, Maroc ",
    email: "mouad.fifel.contact@gmail.com",
    availability: "Can start one month after my application is accepted",
    brand:
    "I graduated with a Bachelor's degree in Mathematics and Computer Science from the Multidisciplinary Faculty of Ouarzazate. I also completed two years of training at YouCode School. I started my career at Cegedim as a Full-Stack Developer intern and later transitioned to a DevOps role. Today, I am working as a DevOps Engineer, with more than two years of overall experience at Cegedim, contributing to software development, automation, CI/CD, and infrastructure management.",
  };

  return (
    <>
      <Header />
      <AnimatedRoutes personalDetails={personalDetails} />
    </>
  );
}

export default App;
