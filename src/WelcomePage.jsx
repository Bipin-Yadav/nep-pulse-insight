import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Sparkles } from "lucide-react";

const WelcomePage = ({ onStart }) => {
  return (
    <motion.div
      className="form-card"
      style={{ textAlign: "center", maxWidth: "42rem", width: "100%", position: "relative", overflow: "visible" }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Decorative floating glassmorphic particles */}
      <motion.div
        style={{
          position: "absolute",
          top: "-5%",
          right: "-5%",
          width: "2.5rem",
          height: "2.5rem",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #a78bfa 0%, #db2777 100%)",
          filter: "blur(4px)",
          opacity: 0.6,
          pointerEvents: "none",
          zIndex: -1
        }}
        animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />
      <motion.div
        style={{
          position: "absolute",
          bottom: "-5%",
          left: "-5%",
          width: "3.5rem",
          height: "3.5rem",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
          filter: "blur(5px)",
          opacity: 0.5,
          pointerEvents: "none",
          zIndex: -1
        }}
        animate={{ y: [0, 20, 0], x: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0.5 }}
      />
      <div className="form-header" style={{ marginBottom: "1.5rem" }}>
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          style={{ display: "inline-block", marginBottom: "1rem" }}
        >
          <BookOpen size={64} color="#c4b5fd" style={{ margin: "0 auto" }} />
        </motion.div>
        
        <h1 className="form-title" style={{ 
          fontSize: "2.25rem", 
          fontWeight: "800",
          background: "linear-gradient(to right, #a78bfa, #ec4899)", 
          WebkitBackgroundClip: "text", 
          WebkitTextFillColor: "transparent",
          marginBottom: "1rem"
        }}>
          NEP Pulse Survey 2025
        </h1>
        
        <p className="form-subtitle" style={{ 
          fontSize: "1.1rem", 
          lineHeight: "1.6",
          color: "#c4b5fd"
        }}>
          Help us evaluate and understand the impact of the National Education Policy (NEP) 2020 on academic structures, curriculum flexibility, and student experiences.
        </p>
      </div>

      <div style={{ 
        background: "rgba(255, 255, 255, 0.03)", 
        borderRadius: "1rem", 
        padding: "1.25rem", 
        border: "1px solid rgba(255, 255, 255, 0.05)",
        marginBottom: "2.25rem"
      }}>
        <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.95rem", lineHeight: "1.5", margin: 0 }}>
          💡 <strong>Note:</strong> This survey is brief and covers topics such as academic stream flexibility, syllabus workload, and internship opportunities under the new system. Your responses are highly valuable.
        </p>
      </div>

      <motion.button
        onClick={onStart}
        className="btn btn-next"
        style={{ 
          fontSize: "1.1rem", 
          padding: "0.875rem 2.5rem", 
          margin: "0 auto", 
          display: "inline-flex", 
          justifyContent: "center", 
          alignItems: "center", 
          gap: "0.75rem",
          borderRadius: "1rem",
          boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.3)"
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>Start Survey</span>
        <Sparkles size={18} />
      </motion.button>
    </motion.div>
  );
};

export default WelcomePage;
