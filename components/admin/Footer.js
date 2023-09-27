import React from "react";

function Footer() {
  return (
    <section id="footer">
      <div
        style={{ textAlign: "center", marginTop: "50px", marginBottom: "50px" }}
      >
        <p style={{ color: "#777" }}>
          Copyright &copy; Automobelite {new Date().getFullYear()} ®. Tous
          droits réservés{" "}
        </p>
      </div>
    </section>
  );
}

export default Footer;
