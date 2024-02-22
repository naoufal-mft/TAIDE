-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema ai_website_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema ai_website_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS ai_website_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE ai_website_db ;

-- -----------------------------------------------------
-- Table ai_website_db.login
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_website_db.login (
  id_user INT NOT NULL,
  email VARCHAR(45) NOT NULL,
  password VARCHAR(45) NOT NULL,
  PRIMARY KEY (id_user),
  UNIQUE INDEX email_UNIQUE (email ASC) VISIBLE,
  UNIQUE INDEX id_user_UNIQUE (id_user ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table ai_website_db.user
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_website_db.user (
  iduser INT NOT NULL AUTO_INCREMENT,
  nom VARCHAR(45) NOT NULL,
  prenom VARCHAR(45) NOT NULL,
  username VARCHAR(45) NULL DEFAULT NULL,
  dob DATE NULL DEFAULT NULL,
  PRIMARY KEY (iduser),
  UNIQUE INDEX iduser_UNIQUE (iduser ASC) VISIBLE,
  UNIQUE INDEX userrname_UNIQUE (username ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 25
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table ai_website_db.stocks
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_website_db.stocks (
  user INT NOT NULL,
  stock VARCHAR(45) NOT NULL,
  INDEX iduser_idx (user ASC) VISIBLE,
  CONSTRAINT iduser
    FOREIGN KEY (user)
    REFERENCES ai_website_db.user (iduser))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
