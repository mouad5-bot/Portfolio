const SocialIcons = () => {
  const styles = {
    icon: {
      textDecoration: "none",
      fontSize: "22px",
      padding: "10px",
      transition: "0.2s ease-in",
    },
  };

  return (
    <div className="socialIcons" style={styles.socialIcons}>
      <a className="icon" style={styles.icon} href="https://github.com/mouad5-bot">
        <i className="fa-brands fa-github" aria-hidden="true" title="mfifel's GitHub Profile"></i>
      </a>
      <a className="icon" style={styles.icon} href="https://www.linkedin.com/in/mouad-fifel/">
        <i className="fa-brands fa-linkedin" aria-hidden="true" title="mfifel's LinkedIn Profile"></i>
      </a>
      <a className="icon" style={styles.icon} href="https://www.instagram.com/mouad_fiiifel/">
        <i className="fa-brands fa-instagram" aria-hidden="true" title="mfifel's Instagram Profile"></i>
      </a>
      <a className="icon" style={styles.icon} href="https://www.facebook.com/">
        <i className="fa-brands fa-facebook" aria-hidden="true" title="mfifel's facebook Profile"></i>
      </a>
    </div>
  );
};

export default SocialIcons;
