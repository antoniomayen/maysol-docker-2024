-- MySQL dump 10.13  Distrib 8.0.30, for Linux (x86_64)
--
-- Host: localhost    Database: borderless
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can add permission',2,'add_permission'),(5,'Can change permission',2,'change_permission'),(6,'Can delete permission',2,'delete_permission'),(7,'Can add group',3,'add_group'),(8,'Can change group',3,'change_group'),(9,'Can delete group',3,'delete_group'),(10,'Can add content type',4,'add_contenttype'),(11,'Can change content type',4,'change_contenttype'),(12,'Can delete content type',4,'delete_contenttype'),(13,'Can add session',5,'add_session'),(14,'Can change session',5,'change_session'),(15,'Can delete session',5,'delete_session'),(16,'Can add Token',6,'add_token'),(17,'Can change Token',6,'change_token'),(18,'Can delete Token',6,'delete_token'),(19,'Can add user',7,'add_usuario'),(20,'Can change user',7,'change_usuario'),(21,'Can delete user',7,'delete_usuario'),(22,'Can add afectados',8,'add_afectados'),(23,'Can change afectados',8,'change_afectados'),(24,'Can delete afectados',8,'delete_afectados'),(25,'Can add cierre',9,'add_cierre'),(26,'Can change cierre',9,'change_cierre'),(27,'Can delete cierre',9,'delete_cierre'),(28,'Can add cuenta',10,'add_cuenta'),(29,'Can change cuenta',10,'change_cuenta'),(30,'Can delete cuenta',10,'delete_cuenta'),(31,'Can add movimiento',11,'add_movimiento'),(32,'Can change movimiento',11,'change_movimiento'),(33,'Can delete movimiento',11,'delete_movimiento'),(34,'Can add proyecto',12,'add_proyecto'),(35,'Can change proyecto',12,'change_proyecto'),(36,'Can delete proyecto',12,'delete_proyecto'),(37,'Can add categorias',13,'add_categorias'),(38,'Can change categorias',13,'change_categorias'),(39,'Can delete categorias',13,'delete_categorias'),(40,'Can add bodega',14,'add_bodega'),(41,'Can change bodega',14,'change_bodega'),(42,'Can delete bodega',14,'delete_bodega'),(43,'Can add contacto proveedor',15,'add_contactoproveedor'),(44,'Can change contacto proveedor',15,'change_contactoproveedor'),(45,'Can delete contacto proveedor',15,'delete_contactoproveedor'),(46,'Can add cuenta proveedor',16,'add_cuentaproveedor'),(47,'Can change cuenta proveedor',16,'change_cuentaproveedor'),(48,'Can delete cuenta proveedor',16,'delete_cuentaproveedor'),(49,'Can add proveedor',17,'add_proveedor'),(50,'Can change proveedor',17,'change_proveedor'),(51,'Can delete proveedor',17,'delete_proveedor'),(52,'Can add fraccion',18,'add_fraccion'),(53,'Can change fraccion',18,'change_fraccion'),(54,'Can delete fraccion',18,'delete_fraccion'),(55,'Can add producto',19,'add_producto'),(56,'Can change producto',19,'change_producto'),(57,'Can delete producto',19,'delete_producto'),(58,'Can add permiso',20,'add_permiso'),(59,'Can change permiso',20,'change_permiso'),(60,'Can delete permiso',20,'delete_permiso'),(61,'Can add detalle movimiento',21,'add_detallemovimiento'),(62,'Can change detalle movimiento',21,'change_detallemovimiento'),(63,'Can delete detalle movimiento',21,'delete_detallemovimiento'),(64,'Can add detalle mov bodega',22,'add_detallemovbodega'),(65,'Can change detalle mov bodega',22,'change_detallemovbodega'),(66,'Can delete detalle mov bodega',22,'delete_detallemovbodega'),(67,'Can add movimiento bodega',23,'add_movimientobodega'),(68,'Can change movimiento bodega',23,'change_movimientobodega'),(69,'Can delete movimiento bodega',23,'delete_movimientobodega'),(70,'Can add linea produccion',24,'add_lineaproduccion'),(71,'Can change linea produccion',24,'change_lineaproduccion'),(72,'Can delete linea produccion',24,'delete_lineaproduccion'),(73,'Can add lote',25,'add_lote'),(74,'Can change lote',25,'change_lote'),(75,'Can delete lote',25,'delete_lote'),(76,'Can add inventario',26,'add_inventario'),(77,'Can change inventario',26,'change_inventario'),(78,'Can delete inventario',26,'delete_inventario'),(79,'Can add detalle mov granja',27,'add_detallemovgranja'),(80,'Can change detalle mov granja',27,'change_detallemovgranja'),(81,'Can delete detalle mov granja',27,'delete_detallemovgranja'),(82,'Can add movimiento granja',28,'add_movimientogranja'),(83,'Can change movimiento granja',28,'change_movimientogranja'),(84,'Can delete movimiento granja',28,'delete_movimientogranja'),(85,'Can add cliente',29,'add_cliente'),(86,'Can change cliente',29,'change_cliente'),(87,'Can delete cliente',29,'delete_cliente'),(88,'Can add cambio moneda',30,'add_cambiomoneda'),(89,'Can change cambio moneda',30,'change_cambiomoneda'),(90,'Can delete cambio moneda',30,'delete_cambiomoneda'),(91,'Can add preciofraccion',31,'add_preciofraccion'),(92,'Can change preciofraccion',31,'change_preciofraccion'),(93,'Can delete preciofraccion',31,'delete_preciofraccion'),(94,'Can view log entry',1,'view_logentry'),(95,'Can view permission',2,'view_permission'),(96,'Can view group',3,'view_group'),(97,'Can view content type',4,'view_contenttype'),(98,'Can view session',5,'view_session'),(99,'Can view Token',6,'view_token'),(100,'Can view user',7,'view_usuario'),(101,'Can view afectados',8,'view_afectados'),(102,'Can view cierre',9,'view_cierre'),(103,'Can view cuenta',10,'view_cuenta'),(104,'Can view movimiento',11,'view_movimiento'),(105,'Can view proyecto',12,'view_proyecto'),(106,'Can view categorias',13,'view_categorias'),(107,'Can view bodega',14,'view_bodega'),(108,'Can view contacto proveedor',15,'view_contactoproveedor'),(109,'Can view cuenta proveedor',16,'view_cuentaproveedor'),(110,'Can view proveedor',17,'view_proveedor'),(111,'Can view fraccion',18,'view_fraccion'),(112,'Can view producto',19,'view_producto'),(113,'Can view permiso',20,'view_permiso'),(114,'Can view detalle movimiento',21,'view_detallemovimiento'),(115,'Can view detalle mov bodega',22,'view_detallemovbodega'),(116,'Can view movimiento bodega',23,'view_movimientobodega'),(117,'Can view linea produccion',24,'view_lineaproduccion'),(118,'Can view lote',25,'view_lote'),(119,'Can view inventario',26,'view_inventario'),(120,'Can view detalle mov granja',27,'view_detallemovgranja'),(121,'Can view movimiento granja',28,'view_movimientogranja'),(122,'Can view cambio moneda',30,'view_cambiomoneda'),(123,'Can view preciofraccion',31,'view_preciofraccion');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authtoken_token`
--

DROP TABLE IF EXISTS `authtoken_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authtoken_token` (
  `key` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created` datetime(6) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`key`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `authtoken_token_user_id_35299eff_fk_backend_usuario_id` FOREIGN KEY (`user_id`) REFERENCES `backend_usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authtoken_token`
--

LOCK TABLES `authtoken_token` WRITE;
/*!40000 ALTER TABLE `authtoken_token` DISABLE KEYS */;
INSERT INTO `authtoken_token` VALUES ('4b201e510622c41f2c6dd5537b34ed5734bac60a','2019-02-05 16:48:20.454423',5),('89ab55d129c21accbc18c34e2e657700398db9dc','2018-12-14 21:56:19.725812',1);
/*!40000 ALTER TABLE `authtoken_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_afectados`
--

DROP TABLE IF EXISTS `backend_afectados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_afectados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo` int NOT NULL,
  `cierre_id` int NOT NULL,
  `movimiento_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `backend_afectados_cierre_id_20d16b21_fk_backend_cierre_id` (`cierre_id`),
  KEY `backend_afectados_movimiento_id_544af7f6_fk_backend_m` (`movimiento_id`),
  CONSTRAINT `backend_afectados_cierre_id_20d16b21_fk_backend_cierre_id` FOREIGN KEY (`cierre_id`) REFERENCES `backend_cierre` (`id`),
  CONSTRAINT `backend_afectados_movimiento_id_544af7f6_fk_backend_m` FOREIGN KEY (`movimiento_id`) REFERENCES `backend_movimiento` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_afectados`
--

LOCK TABLES `backend_afectados` WRITE;
/*!40000 ALTER TABLE `backend_afectados` DISABLE KEYS */;
INSERT INTO `backend_afectados` VALUES (1,10,1,1),(2,30,2,2),(3,10,3,2),(4,20,2,3),(5,20,2,7),(6,30,4,8),(7,10,5,8),(8,10,6,9),(9,20,4,13),(10,20,4,16),(11,20,3,30),(12,20,8,32),(13,20,8,34),(14,10,8,42),(15,20,8,44),(16,20,4,46),(17,20,4,52),(18,20,6,56),(19,20,8,59),(20,20,5,62),(21,20,5,66),(22,20,4,67),(23,20,3,69),(24,20,3,71),(25,20,4,73),(26,20,6,74),(27,20,4,78),(28,20,4,84),(29,20,3,86),(30,60,4,87),(31,70,10,87),(32,70,12,89),(33,70,8,91),(34,70,12,92),(35,10,4,93),(36,70,13,94),(37,70,13,95),(38,10,8,96),(39,10,14,97),(40,20,14,98),(41,20,15,99),(42,20,15,100),(43,70,15,102),(44,70,15,103),(45,70,13,104),(46,70,13,107),(47,10,14,108),(48,70,17,110),(49,10,14,111),(50,70,19,113),(51,70,20,115),(52,70,20,117),(53,70,18,119);
/*!40000 ALTER TABLE `backend_afectados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_bodega`
--

DROP TABLE IF EXISTS `backend_bodega`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_bodega` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(140) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `direccion` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `creado` datetime(6) NOT NULL,
  `modificado` datetime(6) NOT NULL,
  `activa` tinyint(1) NOT NULL,
  `creado_por_id` int NOT NULL,
  `empresa_id` int NOT NULL,
  `encargado_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `encargado_id` (`encargado_id`),
  KEY `backend_bodega_creado_por_id_a2d59012_fk_backend_usuario_id` (`creado_por_id`),
  KEY `backend_bodega_empresa_id_1280f676_fk_backend_proyecto_id` (`empresa_id`),
  CONSTRAINT `backend_bodega_creado_por_id_a2d59012_fk_backend_usuario_id` FOREIGN KEY (`creado_por_id`) REFERENCES `backend_usuario` (`id`),
  CONSTRAINT `backend_bodega_empresa_id_1280f676_fk_backend_proyecto_id` FOREIGN KEY (`empresa_id`) REFERENCES `backend_proyecto` (`id`),
  CONSTRAINT `backend_bodega_encargado_id_d2e832b4_fk_backend_usuario_id` FOREIGN KEY (`encargado_id`) REFERENCES `backend_usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_bodega`
--

LOCK TABLES `backend_bodega` WRITE;
/*!40000 ALTER TABLE `backend_bodega` DISABLE KEYS */;
INSERT INTO `backend_bodega` VALUES (1,'Maysol Huitan','Huitan','2018-12-14 22:37:51.113134','2019-05-06 23:27:01.071365',1,1,1,NULL),(2,'Maysol Xela','Xela','2018-12-14 22:38:05.775112','2018-12-14 22:38:05.775164',1,1,1,NULL),(3,'Iloito Xela','Xela','2018-12-14 22:38:32.796994','2018-12-14 22:38:32.797068',1,1,2,NULL),(4,'Iloito Xela','Xela','2018-12-14 22:39:08.923247','2018-12-14 22:39:08.923302',1,1,2,NULL);
/*!40000 ALTER TABLE `backend_bodega` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_cambiomoneda`
--

DROP TABLE IF EXISTS `backend_cambiomoneda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_cambiomoneda` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha_dolar` date NOT NULL,
  `cambio_dolar` double NOT NULL,
  `fecha_yen` date NOT NULL,
  `cambio_yen_dolar` double NOT NULL,
  `cambio_yen` double NOT NULL,
  `creado` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_cambiomoneda`
--

LOCK TABLES `backend_cambiomoneda` WRITE;
/*!40000 ALTER TABLE `backend_cambiomoneda` DISABLE KEYS */;
INSERT INTO `backend_cambiomoneda` VALUES (1,'2019-02-05',7.75934,'2019-02-05',109.86,14.1584206904195,'2019-02-05 15:42:08.501195');
/*!40000 ALTER TABLE `backend_cambiomoneda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_categorias`
--

DROP TABLE IF EXISTS `backend_categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(240) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombrejapones` varchar(240) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `activo` tinyint(1) NOT NULL,
  `cf` int DEFAULT NULL,
  `pl` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_categorias`
--

LOCK TABLES `backend_categorias` WRITE;
/*!40000 ALTER TABLE `backend_categorias` DISABLE KEYS */;
INSERT INTO `backend_categorias` VALUES (1,'Gasolina','333',1,13,NULL),(2,'comestibles','こんにちは',1,9,22),(3,'Test','機械・備品・車両-',1,1,21);
/*!40000 ALTER TABLE `backend_categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_cierre`
--

DROP TABLE IF EXISTS `backend_cierre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_cierre` (
  `id` int NOT NULL AUTO_INCREMENT,
  `inicio` double NOT NULL,
  `fin` double DEFAULT NULL,
  `mes` int DEFAULT NULL,
  `anio` int DEFAULT NULL,
  `cerrado` tinyint(1) NOT NULL,
  `creado` datetime(6) NOT NULL,
  `modificado` datetime(6) NOT NULL,
  `fechaInicio` datetime(6) DEFAULT NULL,
  `cuenta_id` int DEFAULT NULL,
  `origen_id` int DEFAULT NULL,
  `descripcion` varchar(240) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `archivo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usuarioCierre_id` int DEFAULT NULL,
  `ext` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fechaCierre` date DEFAULT NULL,
  `anulado` tinyint(1) NOT NULL,
  `justificacion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `movimiento_cierre_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `origen_id` (`origen_id`),
  KEY `backend_cierre_cuenta_id_34c52fa4_fk_backend_cuenta_id` (`cuenta_id`),
  KEY `backend_cierre_usuarioCierre_id_406e06d8_fk_backend_usuario_id` (`usuarioCierre_id`),
  KEY `backend_cierre_movimiento_cierre_id_ccee2fd5_fk_backend_m` (`movimiento_cierre_id`),
  CONSTRAINT `backend_cierre_cuenta_id_34c52fa4_fk_backend_cuenta_id` FOREIGN KEY (`cuenta_id`) REFERENCES `backend_cuenta` (`id`),
  CONSTRAINT `backend_cierre_movimiento_cierre_id_ccee2fd5_fk_backend_m` FOREIGN KEY (`movimiento_cierre_id`) REFERENCES `backend_movimiento` (`id`),
  CONSTRAINT `backend_cierre_origen_id_e2ee8b0e_fk_backend_movimiento_id` FOREIGN KEY (`origen_id`) REFERENCES `backend_movimiento` (`id`),
  CONSTRAINT `backend_cierre_usuarioCierre_id_406e06d8_fk_backend_usuario_id` FOREIGN KEY (`usuarioCierre_id`) REFERENCES `backend_usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_cierre`
--

LOCK TABLES `backend_cierre` WRITE;
/*!40000 ALTER TABLE `backend_cierre` DISABLE KEYS */;
INSERT INTO `backend_cierre` VALUES (1,0,342342,10,2018,1,'2018-12-14 21:59:39.019212','2018-12-14 22:01:14.758773','2018-10-01 00:00:00.000000',2,NULL,NULL,'cierrescuentas/2018/12/14/IMG_20181024_165520.jpg',1,'img','2018-12-14',0,NULL,NULL),(2,342342,NULL,11,2018,0,'2018-12-14 22:02:04.979019','2018-12-14 22:02:04.979071','2018-11-01 00:00:00.000000',2,NULL,NULL,'',NULL,NULL,NULL,0,NULL,NULL),(3,500,NULL,12,2018,0,'2018-12-14 22:02:05.004275','2018-12-14 22:02:05.004329','2018-11-14 00:00:00.000000',1,2,NULL,'',NULL,NULL,NULL,0,NULL,NULL),(4,0,NULL,1,2019,0,'2019-01-03 15:23:34.312681','2019-01-03 15:23:34.312743','2019-01-01 00:00:00.000000',2,NULL,NULL,'',NULL,NULL,NULL,0,NULL,NULL),(5,5000,NULL,1,2019,0,'2019-01-03 15:23:34.372760','2019-01-03 15:23:34.372799','2019-01-02 00:00:00.000000',1,8,NULL,'',NULL,NULL,NULL,0,NULL,NULL),(6,0,NULL,1,2019,0,'2019-01-03 15:30:47.534358','2019-01-03 15:30:47.534411','2019-01-01 00:00:00.000000',6,NULL,NULL,'',NULL,NULL,NULL,0,NULL,NULL),(8,0,NULL,1,2019,0,'2019-01-04 22:24:13.057138','2019-01-04 22:24:13.057188','2019-01-01 00:00:00.000000',3,NULL,NULL,'',NULL,NULL,NULL,0,NULL,NULL),(10,0,NULL,1,2019,0,'2019-01-25 21:58:41.531474','2019-01-25 21:58:41.531525','2019-01-01 00:00:00.000000',4,NULL,NULL,'',NULL,NULL,NULL,0,NULL,NULL),(11,20000,NULL,1,2019,0,'2019-01-25 21:58:41.546172','2019-01-25 21:58:41.546210','2019-01-11 00:00:00.000000',13,87,'test','',NULL,NULL,NULL,0,NULL,NULL),(12,0,350,1,2019,1,'2019-01-25 22:05:14.671712','2019-01-25 22:17:41.693027','2019-01-25 00:00:00.000000',10,NULL,NULL,'',1,NULL,'2019-01-25',0,NULL,NULL),(13,350,3660,1,2019,1,'2019-01-25 22:17:41.694559','2019-02-05 16:42:44.296906','2019-01-25 00:00:00.000000',10,NULL,NULL,'',1,NULL,'2019-02-05',0,NULL,NULL),(14,0,NULL,2,2019,0,'2019-02-05 14:57:04.396763','2019-02-05 14:57:04.396843','2019-02-01 00:00:00.000000',16,NULL,NULL,'',NULL,NULL,NULL,0,NULL,NULL),(15,0,NULL,2,2019,0,'2019-02-05 15:44:24.904612','2019-02-05 15:44:24.904663','2019-02-01 00:00:00.000000',2,NULL,NULL,'',NULL,NULL,NULL,0,NULL,NULL),(16,3660,0,2,2019,1,'2019-02-05 16:42:44.300381','2019-02-05 17:01:29.378167','2019-02-05 00:00:00.000000',10,NULL,NULL,'',1,NULL,'2019-02-05',0,NULL,NULL),(17,0,NULL,2,2019,0,'2019-02-05 16:49:09.489440','2019-02-05 16:49:09.489504','2019-02-05 00:00:00.000000',18,NULL,NULL,'',NULL,NULL,NULL,0,NULL,NULL),(18,0,NULL,2,2019,0,'2019-02-05 17:01:29.380085','2019-02-05 17:01:29.380132','2019-02-05 00:00:00.000000',10,NULL,NULL,'',NULL,NULL,NULL,0,NULL,NULL),(19,0,NULL,3,2019,0,'2019-03-26 16:40:53.959350','2019-03-26 16:40:53.959392','2019-03-01 00:00:00.000000',4,NULL,NULL,'',NULL,NULL,NULL,0,NULL,NULL),(20,0,NULL,5,2019,0,'2019-05-06 16:28:22.355624','2019-05-06 16:28:22.355679','2019-05-01 00:00:00.000000',2,NULL,NULL,'',NULL,NULL,NULL,0,NULL,NULL);
/*!40000 ALTER TABLE `backend_cierre` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_contactoproveedor`
--

DROP TABLE IF EXISTS `backend_contactoproveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_contactoproveedor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `puesto` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `correo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `creado` datetime(6) NOT NULL,
  `modificado` datetime(6) NOT NULL,
  `activo` tinyint(1) NOT NULL,
  `proveedor_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `backend_contactoprov_proveedor_id_52d1cd76_fk_backend_p` (`proveedor_id`),
  CONSTRAINT `backend_contactoprov_proveedor_id_52d1cd76_fk_backend_p` FOREIGN KEY (`proveedor_id`) REFERENCES `backend_proveedor` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_contactoproveedor`
--

LOCK TABLES `backend_contactoproveedor` WRITE;
/*!40000 ALTER TABLE `backend_contactoproveedor` DISABLE KEYS */;
/*!40000 ALTER TABLE `backend_contactoproveedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_cuenta`
--

DROP TABLE IF EXISTS `backend_cuenta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_cuenta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero` varchar(70) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nombre` varchar(130) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `banco` varchar(130) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `saldo` double DEFAULT NULL,
  `tipo` int NOT NULL,
  `estado` tinyint(1) NOT NULL,
  `deudor_id` int DEFAULT NULL,
  `proyecto_id` int DEFAULT NULL,
  `moneda` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `movimientoPrestamo_id` int DEFAULT NULL,
  `cuentaAcreedor_id` int DEFAULT NULL,
  `cuentaDeudor_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `backend_cuenta_deudor_id_a3f8af34_fk_backend_proyecto_id` (`deudor_id`),
  KEY `backend_cuenta_proyecto_id_9931b2eb_fk_backend_proyecto_id` (`proyecto_id`),
  KEY `backend_cuenta_movimientoPrestamo_i_bfb7ecfb_fk_backend_m` (`movimientoPrestamo_id`),
  KEY `backend_cuenta_cuentaAcreedor_id_f19070aa_fk_backend_cuenta_id` (`cuentaAcreedor_id`),
  KEY `backend_cuenta_cuentaDeudor_id_9e00e557_fk_backend_cuenta_id` (`cuentaDeudor_id`),
  CONSTRAINT `backend_cuenta_cuentaAcreedor_id_f19070aa_fk_backend_cuenta_id` FOREIGN KEY (`cuentaAcreedor_id`) REFERENCES `backend_cuenta` (`id`),
  CONSTRAINT `backend_cuenta_cuentaDeudor_id_9e00e557_fk_backend_cuenta_id` FOREIGN KEY (`cuentaDeudor_id`) REFERENCES `backend_cuenta` (`id`),
  CONSTRAINT `backend_cuenta_deudor_id_a3f8af34_fk_backend_proyecto_id` FOREIGN KEY (`deudor_id`) REFERENCES `backend_proyecto` (`id`),
  CONSTRAINT `backend_cuenta_movimientoPrestamo_i_bfb7ecfb_fk_backend_m` FOREIGN KEY (`movimientoPrestamo_id`) REFERENCES `backend_movimiento` (`id`),
  CONSTRAINT `backend_cuenta_proyecto_id_9931b2eb_fk_backend_proyecto_id` FOREIGN KEY (`proyecto_id`) REFERENCES `backend_proyecto` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_cuenta`
--

LOCK TABLES `backend_cuenta` WRITE;
/*!40000 ALTER TABLE `backend_cuenta` DISABLE KEYS */;
INSERT INTO `backend_cuenta` VALUES (1,'Caja chica','Borderless','Banco Industrial',NULL,30,1,NULL,1,'GTQ',NULL,NULL,NULL),(2,'3990038097','Borderless Guatemala, S.A.','Banco Industrial',NULL,10,1,NULL,1,'GTQ',NULL,NULL,NULL),(3,'342342','Iloito dolares','Banco Industrial',NULL,10,1,NULL,2,'USD',NULL,NULL,NULL),(4,'3423445','Iloito quetzales','Banco Industrial',NULL,10,1,NULL,2,'GTQ',NULL,NULL,NULL),(5,'CChica Yorch ','CChica Yorch ','Caja chica',NULL,30,1,NULL,2,'GTQ',NULL,NULL,NULL),(6,'409358043583','Dolares Borderless','Banco Industrial',NULL,10,1,NULL,1,'USD',NULL,NULL,NULL),(7,'Huitan 1','Huitan 1','Huitan 1',NULL,50,1,NULL,4,'',NULL,NULL,NULL),(8,'Huitan 2','Huitan 2','Huitan 2',NULL,50,1,NULL,5,'',NULL,NULL,NULL),(9,'CChica Carlos Prueba','CChica Carlos Prueba','Caja chica',NULL,30,1,NULL,3,'GTQ',NULL,NULL,NULL),(10,'CVenta Admin','CVenta Admin','Caja de Venta',NULL,60,1,NULL,1,'GTQ',NULL,NULL,NULL),(11,'CVenta Yorch ','CVenta Yorch ','Caja de Venta',NULL,60,1,NULL,2,'GTQ',NULL,NULL,NULL),(12,'CVenta Carlos Prueba','CVenta Carlos Prueba','Caja de Venta',NULL,60,1,NULL,3,'GTQ',NULL,NULL,NULL),(13,NULL,NULL,NULL,20000,40,1,2,1,'GTQ',87,NULL,NULL),(14,'CChica sdfsdf','CChica sdfsdf','Caja chica',NULL,30,1,NULL,2,'GTQ',NULL,NULL,NULL),(15,'CVenta sdfsdf','CVenta sdfsdf','Caja de Venta',NULL,60,1,NULL,2,'GTQ',NULL,NULL,NULL),(16,'24234234234234','Cuenta Maysol Quetzales','Azteca',NULL,10,1,NULL,3,'GTQ',NULL,NULL,NULL),(17,'CChica Prueba','CChica Prueba','Caja chica',NULL,30,1,NULL,3,'GTQ',NULL,NULL,NULL),(18,'CVenta Prueba','CVenta Prueba','Caja de Venta',NULL,60,1,NULL,3,'GTQ',NULL,NULL,NULL);
/*!40000 ALTER TABLE `backend_cuenta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_cuentaproveedor`
--

DROP TABLE IF EXISTS `backend_cuentaproveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_cuentaproveedor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `banco` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `numero` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `creado` datetime(6) NOT NULL,
  `modificado` datetime(6) NOT NULL,
  `activo` tinyint(1) NOT NULL,
  `proveedor_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `backend_cuentaprovee_proveedor_id_5dd88e2f_fk_backend_p` (`proveedor_id`),
  CONSTRAINT `backend_cuentaprovee_proveedor_id_5dd88e2f_fk_backend_p` FOREIGN KEY (`proveedor_id`) REFERENCES `backend_proveedor` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_cuentaproveedor`
--

LOCK TABLES `backend_cuentaproveedor` WRITE;
/*!40000 ALTER TABLE `backend_cuentaproveedor` DISABLE KEYS */;
INSERT INTO `backend_cuentaproveedor` VALUES (1,'134423','23424','MONETARIO','2018-12-14 22:04:41.895055','2018-12-14 22:04:41.895089',1,1);
/*!40000 ALTER TABLE `backend_cuentaproveedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_detallemovbodega`
--

DROP TABLE IF EXISTS `backend_detallemovbodega`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_detallemovbodega` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cantidadInicial` int NOT NULL,
  `cantidad` int DEFAULT NULL,
  `activo` tinyint(1) NOT NULL,
  `stock_id` int NOT NULL,
  `lote_id` int DEFAULT NULL,
  `movimiento_id` int DEFAULT NULL,
  `cantidadFinal` int DEFAULT NULL,
  `cantidadActual` int DEFAULT NULL,
  `costo_total` double NOT NULL,
  `costo_unitario` double NOT NULL,
  `movimientoCosto_id` int DEFAULT NULL,
  `movimiento_original_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `backend_detallemovbo_stock_id_d66f346c_fk_backend_f` (`stock_id`),
  KEY `backend_detallemovbodega_lote_id_2d14b06f_fk_backend_lote_id` (`lote_id`),
  KEY `backend_detallemovbo_movimiento_id_c590cba0_fk_backend_m` (`movimiento_id`),
  KEY `backend_detallemovbo_movimientoCosto_id_d42efdd3_fk_backend_m` (`movimientoCosto_id`),
  KEY `backend_detallemovbo_movimiento_original__1e712e97_fk_backend_m` (`movimiento_original_id`),
  CONSTRAINT `backend_detallemovbo_movimiento_id_c590cba0_fk_backend_m` FOREIGN KEY (`movimiento_id`) REFERENCES `backend_movimientobodega` (`id`),
  CONSTRAINT `backend_detallemovbo_movimiento_original__1e712e97_fk_backend_m` FOREIGN KEY (`movimiento_original_id`) REFERENCES `backend_movimientobodega` (`id`),
  CONSTRAINT `backend_detallemovbo_movimientoCosto_id_d42efdd3_fk_backend_m` FOREIGN KEY (`movimientoCosto_id`) REFERENCES `backend_movimiento` (`id`),
  CONSTRAINT `backend_detallemovbo_stock_id_d66f346c_fk_backend_f` FOREIGN KEY (`stock_id`) REFERENCES `backend_fraccion` (`id`),
  CONSTRAINT `backend_detallemovbodega_lote_id_2d14b06f_fk_backend_lote_id` FOREIGN KEY (`lote_id`) REFERENCES `backend_lote` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_detallemovbodega`
--

LOCK TABLES `backend_detallemovbodega` WRITE;
/*!40000 ALTER TABLE `backend_detallemovbodega` DISABLE KEYS */;
INSERT INTO `backend_detallemovbodega` VALUES (1,32,32,1,3,1,1,32,NULL,0,0,NULL,NULL),(2,34,34,1,2,1,1,34,NULL,0,0,NULL,NULL),(3,100,100,1,5,1,1,100,NULL,0,0,NULL,NULL),(4,20,20,1,4,1,1,20,NULL,0,0,NULL,NULL),(5,200,200,1,5,2,2,200,NULL,0,0,NULL,NULL),(6,200,300,1,5,2,5,300,NULL,0,0,NULL,NULL),(7,100,500,1,5,1,6,500,NULL,0,0,NULL,NULL),(8,20,1000,1,4,1,7,1000,NULL,0,0,NULL,NULL),(9,2,2,1,2,5,8,2,NULL,0,0,NULL,NULL),(10,8000,8000,1,3,6,9,8000,NULL,0,0,NULL,NULL),(11,1000,200,1,4,1,10,800,200,0,0,NULL,NULL),(12,500,500,1,5,1,10,0,500,0,0,NULL,NULL),(13,300,100,1,5,2,10,200,100,0,0,NULL,NULL),(14,200,100,1,5,2,11,100,-10,0,0,NULL,NULL),(15,34,30,1,2,1,11,4,0,0,0,NULL,NULL),(16,80,80,1,5,7,12,80,NULL,0,0,NULL,NULL),(17,30,30,1,2,8,12,30,NULL,0,0,NULL,NULL),(18,30,30,1,5,9,13,30,NULL,0,0,NULL,NULL),(19,200,200,1,5,10,14,200,NULL,0,0,NULL,NULL),(20,32,60,1,3,1,15,60,NULL,0,0,NULL,NULL),(21,250,250,1,3,11,16,250,NULL,0,0,NULL,NULL),(22,20,20,1,4,11,16,20,NULL,0,0,NULL,NULL),(23,260,260,1,3,12,17,260,NULL,0,0,NULL,NULL),(24,500,500,1,5,13,18,500,NULL,0,0,NULL,NULL),(25,600,600,1,1,13,18,600,NULL,0,0,NULL,NULL),(26,500,200,1,5,13,19,300,200,0,0,NULL,NULL),(27,4,4,1,2,1,20,0,0,0,0,NULL,NULL),(28,2,1,1,2,5,20,1,0,0,0,NULL,NULL),(29,100,30,1,5,2,20,70,0,0,0,NULL,NULL),(30,4,4,1,2,14,21,4,NULL,0,0,NULL,NULL),(31,1,1,1,2,15,21,1,NULL,0,0,NULL,NULL),(32,30,30,1,5,16,21,30,NULL,0,0,NULL,NULL),(33,80,80,1,5,7,22,0,80,0,0,NULL,NULL),(34,30,20,1,5,9,22,10,20,0,0,NULL,NULL),(35,250,500,1,3,11,23,500,NULL,0,0,NULL,NULL),(36,52,52,1,4,17,24,52,NULL,0,0,NULL,NULL),(37,600,100,1,1,13,25,500,0,0,0,NULL,NULL),(38,100,100,1,1,18,27,100,NULL,0,0,NULL,NULL),(39,100,30,1,1,18,28,70,5,0,0,NULL,NULL),(40,70,40,1,1,18,29,30,40,0,0,NULL,NULL),(41,25,25,1,1,19,30,25,NULL,0,0,NULL,NULL),(42,30,0,1,2,8,31,0,NULL,0,0,NULL,NULL),(43,30,15,1,1,18,32,15,0,0,0,NULL,NULL),(44,15,15,1,1,20,33,15,NULL,0,0,NULL,NULL),(45,500,360,1,5,1,34,140,360,0,0,NULL,NULL),(46,55,30,1,1,18,35,25,30,0,0,NULL,NULL),(47,500,500,1,1,21,36,500,NULL,0,0,NULL,NULL),(48,25,25,1,1,18,37,0,25,0,0,NULL,NULL),(49,500,335,1,1,21,37,165,335,0,0,NULL,NULL),(50,720,720,1,1,22,38,720,NULL,0,0,NULL,NULL),(51,165,165,1,1,21,39,0,165,0,0,NULL,NULL),(52,720,555,1,1,22,39,165,555,0,0,NULL,NULL),(53,165,150,1,1,22,40,15,150,0,0,NULL,NULL),(54,15,1,1,1,22,41,14,1,0,0,NULL,NULL),(55,140,2,1,5,1,42,138,2,0,0,NULL,NULL);
/*!40000 ALTER TABLE `backend_detallemovbodega` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_detallemovgranja`
--

DROP TABLE IF EXISTS `backend_detallemovgranja`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_detallemovgranja` (
  `id` int NOT NULL AUTO_INCREMENT,
  `peso` double NOT NULL,
  `activo` tinyint(1) NOT NULL,
  `movimiento_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `backend_detallemovgr_movimiento_id_26919b5a_fk_backend_m` (`movimiento_id`),
  CONSTRAINT `backend_detallemovgr_movimiento_id_26919b5a_fk_backend_m` FOREIGN KEY (`movimiento_id`) REFERENCES `backend_movimientogranja` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_detallemovgranja`
--

LOCK TABLES `backend_detallemovgranja` WRITE;
/*!40000 ALTER TABLE `backend_detallemovgranja` DISABLE KEYS */;
INSERT INTO `backend_detallemovgranja` VALUES (1,2.58,1,3),(2,2.64,1,3),(3,2.51,1,3),(4,2.48,1,3),(5,2.82,1,3),(6,2.51,1,3),(7,2.31,1,3),(8,2.81,1,3),(9,2.91,1,3),(10,2.5,1,4),(11,2.4,1,4),(12,2.3,1,4),(13,2.7,1,4),(14,2.2,1,5),(15,2,1,5);
/*!40000 ALTER TABLE `backend_detallemovgranja` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_detallemovimiento`
--

DROP TABLE IF EXISTS `backend_detallemovimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_detallemovimiento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cantidad` int NOT NULL,
  `precio_costo` decimal(18,7) NOT NULL,
  `precio_unitario` decimal(18,2) NOT NULL,
  `subtotal` decimal(18,2) NOT NULL,
  `orden_compra_id` int NOT NULL,
  `stock_id` int NOT NULL,
  `cantidadActual` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `backend_detallemovim_orden_compra_id_5adfe97c_fk_backend_m` (`orden_compra_id`),
  KEY `backend_detallemovim_stock_id_8f2eb45d_fk_backend_f` (`stock_id`),
  CONSTRAINT `backend_detallemovim_orden_compra_id_5adfe97c_fk_backend_m` FOREIGN KEY (`orden_compra_id`) REFERENCES `backend_movimiento` (`id`),
  CONSTRAINT `backend_detallemovim_stock_id_8f2eb45d_fk_backend_f` FOREIGN KEY (`stock_id`) REFERENCES `backend_fraccion` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_detallemovimiento`
--

LOCK TABLES `backend_detallemovimiento` WRITE;
/*!40000 ALTER TABLE `backend_detallemovimiento` DISABLE KEYS */;
INSERT INTO `backend_detallemovimiento` VALUES (1,300,10.0000000,0.00,3000.00,4,2,0),(2,20,12.0000000,0.00,240.00,4,3,0),(3,300,10.0000000,0.00,3000.00,6,2,0),(4,20,12.0000000,0.00,240.00,6,3,0),(6,300,20.0000000,0.00,6000.00,12,4,0),(11,32,22.0000000,0.00,704.00,15,3,0),(12,34,200.0000000,0.00,6800.00,15,2,0),(13,300,565.0000000,0.00,169500.00,15,5,0),(14,20,50.0000000,0.00,1000.00,15,4,0),(21,2,126.0000000,0.00,252.00,29,3,2),(27,233243,1.0000000,0.00,233243.00,43,3,233243),(28,2,1.0000000,0.00,2.00,45,2,0),(35,100,5.0000000,0.00,500.00,51,10,100),(36,300,2.0000000,0.00,600.00,51,4,300),(39,200,1.0000000,0.00,200.00,55,5,0),(41,100,1.0000000,0.00,100.00,58,1,100),(43,2,1.0000000,0.00,2.00,61,4,2),(46,500,3.5000000,0.00,1750.00,65,3,-10),(47,20,20.0000000,0.00,400.00,65,4,0),(48,500,1.0000000,0.00,500.00,68,4,500),(49,5,5.0000000,0.00,25.00,70,1,5),(50,600,1.0000000,0.00,600.00,72,5,600),(52,600,6.0000000,0.00,3600.00,77,13,600),(55,3423,2.0000000,0.00,6846.00,83,4,3423),(56,20,5.0000000,0.00,100.00,85,4,20),(57,12,25.0000000,0.00,300.00,88,6,0),(58,20,500.0000000,0.00,10000.00,90,11,-165),(59,3,25.0000000,0.00,75.00,101,2,0),(60,5,500.0000000,0.00,2500.00,105,11,-165),(61,5,25.0000000,0.00,125.00,106,2,0),(62,12,26.0000000,0.00,312.00,109,6,12),(63,1,1.2500000,0.00,1.25,112,1,1),(64,2323,26.0000000,0.00,60398.00,114,6,2323),(65,1,1.2500000,0.00,1.25,116,1,0),(66,2,1.0000000,0.00,2.00,118,5,0);
/*!40000 ALTER TABLE `backend_detallemovimiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_fraccion`
--

DROP TABLE IF EXISTS `backend_fraccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_fraccion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `minimo_existencias` double DEFAULT NULL,
  `presentacion` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `capacidad_maxima` double NOT NULL,
  `precio` double DEFAULT NULL,
  `precio2` double DEFAULT NULL,
  `precio3` double DEFAULT NULL,
  `vendible` tinyint(1) NOT NULL,
  `costo` double DEFAULT NULL,
  `fecha_ultima_compra` datetime(6) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL,
  `creado` datetime(6) NOT NULL,
  `modificado` datetime(6) NOT NULL,
  `parent_id` int DEFAULT NULL,
  `producto_id` int NOT NULL,
  `precioUSD` double DEFAULT NULL,
  `precioUSD2` double DEFAULT NULL,
  `precioUSD3` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `backend_fraccion_parent_id_b863d4a8_fk_backend_fraccion_id` (`parent_id`),
  KEY `backend_fraccion_producto_id_30d0bbb6_fk_backend_producto_id` (`producto_id`),
  CONSTRAINT `backend_fraccion_parent_id_b863d4a8_fk_backend_fraccion_id` FOREIGN KEY (`parent_id`) REFERENCES `backend_fraccion` (`id`),
  CONSTRAINT `backend_fraccion_producto_id_30d0bbb6_fk_backend_producto_id` FOREIGN KEY (`producto_id`) REFERENCES `backend_producto` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_fraccion`
--

LOCK TABLES `backend_fraccion` WRITE;
/*!40000 ALTER TABLE `backend_fraccion` DISABLE KEYS */;
INSERT INTO `backend_fraccion` VALUES (1,NULL,'unidad',1,1.25,1.25,1,1,NULL,NULL,1,'2018-12-14 22:11:32.230762','2019-02-05 16:37:39.197554',NULL,1,NULL,NULL,NULL),(2,NULL,'carton',30,25,0,0,1,NULL,NULL,1,'2018-12-14 22:11:32.242743','2019-02-05 16:37:39.200632',1,1,NULL,NULL,NULL),(3,NULL,'unidad',1,1,0,0,0,NULL,NULL,1,'2018-12-14 22:23:46.318066','2018-12-14 22:23:46.318098',NULL,2,NULL,NULL,NULL),(4,NULL,'unidad',1,1,0,0,0,NULL,NULL,1,'2018-12-14 22:24:12.151975','2018-12-14 22:24:12.152006',NULL,3,NULL,NULL,NULL),(5,NULL,'Unidad',1,1,0,0,1,NULL,NULL,1,'2019-01-03 15:26:25.172684','2019-01-03 15:26:25.172717',NULL,4,NULL,NULL,NULL),(6,NULL,'carton',30,26,25,24,1,NULL,NULL,1,'2019-01-03 15:26:25.179076','2019-01-03 15:26:25.179116',5,4,NULL,NULL,NULL),(10,NULL,'Unidad',1,0,NULL,NULL,0,NULL,NULL,1,'2019-01-12 17:57:55.119983','2019-01-12 17:57:55.121491',NULL,8,NULL,NULL,NULL),(11,NULL,'caja',360,500,0,0,1,NULL,NULL,1,'2019-01-18 21:31:27.242998','2019-02-05 16:37:39.203585',1,1,NULL,NULL,NULL),(13,NULL,'Unidad',1,0,NULL,NULL,0,NULL,NULL,1,'2019-01-18 21:44:55.817370','2019-01-18 21:44:55.817921',NULL,10,NULL,NULL,NULL),(14,NULL,'Unidad',1,100,100,100,1,NULL,NULL,1,'2019-02-05 16:28:38.143476','2019-02-05 16:28:38.145286',NULL,11,12,10,10);
/*!40000 ALTER TABLE `backend_fraccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_inventario`
--

DROP TABLE IF EXISTS `backend_inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_inventario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cantidad` int NOT NULL,
  `activo` tinyint(1) NOT NULL,
  `bodega_id` int NOT NULL,
  `lote_id` int NOT NULL,
  `stock_id` int NOT NULL,
  `costo_total` double NOT NULL,
  `costo_unitario` double NOT NULL,
  `movimiento_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `backend_inventario_bodega_id_7f63f33e_fk_backend_bodega_id` (`bodega_id`),
  KEY `backend_inventario_lote_id_8adfd8ef_fk_backend_lote_id` (`lote_id`),
  KEY `backend_inventario_stock_id_b2ef0381_fk_backend_fraccion_id` (`stock_id`),
  KEY `backend_inventario_movimiento_id_948af805_fk_backend_m` (`movimiento_id`),
  CONSTRAINT `backend_inventario_bodega_id_7f63f33e_fk_backend_bodega_id` FOREIGN KEY (`bodega_id`) REFERENCES `backend_bodega` (`id`),
  CONSTRAINT `backend_inventario_lote_id_8adfd8ef_fk_backend_lote_id` FOREIGN KEY (`lote_id`) REFERENCES `backend_lote` (`id`),
  CONSTRAINT `backend_inventario_movimiento_id_948af805_fk_backend_m` FOREIGN KEY (`movimiento_id`) REFERENCES `backend_movimiento` (`id`),
  CONSTRAINT `backend_inventario_stock_id_b2ef0381_fk_backend_fraccion_id` FOREIGN KEY (`stock_id`) REFERENCES `backend_fraccion` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_inventario`
--

LOCK TABLES `backend_inventario` WRITE;
/*!40000 ALTER TABLE `backend_inventario` DISABLE KEYS */;
INSERT INTO `backend_inventario` VALUES (1,60,1,1,1,3,0,0,NULL),(2,0,1,1,1,2,0,0,NULL),(3,138,1,1,1,5,0,0,NULL),(4,1000,1,1,1,4,0,0,NULL),(5,170,1,1,2,5,0,0,NULL),(6,1,1,1,5,2,0,0,NULL),(7,8000,1,1,6,3,0,0,NULL),(8,0,1,2,7,5,0,0,NULL),(9,0,1,2,8,2,0,0,NULL),(10,10,1,2,9,5,0,0,NULL),(11,200,1,2,10,5,0,0,NULL),(12,500,1,1,11,3,0,0,NULL),(13,20,1,1,11,4,0,0,NULL),(14,260,1,1,12,3,0,0,NULL),(15,300,1,3,13,5,0,0,NULL),(16,500,1,3,13,1,0,0,NULL),(17,4,1,3,14,2,0,0,NULL),(18,1,1,3,15,2,0,0,NULL),(19,30,1,3,16,5,0,0,NULL),(20,52,1,3,17,4,0,0,NULL),(21,0,1,1,18,1,0,0,NULL),(22,25,1,2,19,1,0,0,NULL),(23,15,1,2,20,1,0,0,NULL),(24,0,1,1,21,1,0,0,NULL),(25,14,1,1,22,1,0,0,NULL);
/*!40000 ALTER TABLE `backend_inventario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_lineaproduccion`
--

DROP TABLE IF EXISTS `backend_lineaproduccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_lineaproduccion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `activo` tinyint(1) NOT NULL,
  `empresa_id` int NOT NULL,
  `sumar_en_reporte` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `backend_lineaproducc_empresa_id_366274d4_fk_backend_p` (`empresa_id`),
  CONSTRAINT `backend_lineaproducc_empresa_id_366274d4_fk_backend_p` FOREIGN KEY (`empresa_id`) REFERENCES `backend_proyecto` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_lineaproduccion`
--

LOCK TABLES `backend_lineaproduccion` WRITE;
/*!40000 ALTER TABLE `backend_lineaproduccion` DISABLE KEYS */;
INSERT INTO `backend_lineaproduccion` VALUES (1,'Faldas',1,2,0),(2,'bolsas',1,2,0),(3,'Prueba en borderless',1,1,0);
/*!40000 ALTER TABLE `backend_lineaproduccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_lote`
--

DROP TABLE IF EXISTS `backend_lote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_lote` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lote` date NOT NULL,
  `justificacionAnulacion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `creado` datetime(6) NOT NULL,
  `modificado` datetime(6) NOT NULL,
  `activo` tinyint(1) NOT NULL,
  `bodega_id` int NOT NULL,
  `padre_id` int DEFAULT NULL,
  `empresa_id` int DEFAULT NULL,
  `linea_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `backend_lote_bodega_id_3a9a573c_fk_backend_bodega_id` (`bodega_id`),
  KEY `backend_lote_padre_id_472c7cce_fk_backend_lote_id` (`padre_id`),
  KEY `backend_lote_empresa_id_fe0a47bb_fk_backend_proyecto_id` (`empresa_id`),
  KEY `backend_lote_linea_id_37a96c69_fk_backend_lineaproduccion_id` (`linea_id`),
  CONSTRAINT `backend_lote_bodega_id_3a9a573c_fk_backend_bodega_id` FOREIGN KEY (`bodega_id`) REFERENCES `backend_bodega` (`id`),
  CONSTRAINT `backend_lote_empresa_id_fe0a47bb_fk_backend_proyecto_id` FOREIGN KEY (`empresa_id`) REFERENCES `backend_proyecto` (`id`),
  CONSTRAINT `backend_lote_linea_id_37a96c69_fk_backend_lineaproduccion_id` FOREIGN KEY (`linea_id`) REFERENCES `backend_lineaproduccion` (`id`),
  CONSTRAINT `backend_lote_padre_id_472c7cce_fk_backend_lote_id` FOREIGN KEY (`padre_id`) REFERENCES `backend_lote` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_lote`
--

LOCK TABLES `backend_lote` WRITE;
/*!40000 ALTER TABLE `backend_lote` DISABLE KEYS */;
INSERT INTO `backend_lote` VALUES (1,'2019-01-04',NULL,'2019-01-04 22:53:31.555866','2019-01-04 22:53:31.555898',1,1,NULL,NULL,NULL),(2,'2019-01-04',NULL,'2019-01-04 23:11:19.123569','2019-01-04 23:11:19.123922',1,1,NULL,NULL,NULL),(5,'2019-01-12',NULL,'2019-01-12 18:23:31.621247','2019-01-12 18:23:31.621312',1,1,NULL,NULL,NULL),(6,'2019-01-10',NULL,'2019-01-12 18:25:17.510751','2019-01-12 18:25:17.510781',1,1,NULL,NULL,NULL),(7,'2019-01-04',NULL,'2019-01-12 18:34:17.874577','2019-01-12 18:34:17.874610',1,2,NULL,NULL,NULL),(8,'2019-01-04',NULL,'2019-01-12 18:34:17.882452','2019-01-12 18:34:17.882483',1,2,NULL,NULL,NULL),(9,'2019-01-04',NULL,'2019-01-12 18:34:35.892818','2019-01-12 18:34:35.892881',1,2,NULL,NULL,NULL),(10,'2019-01-12',NULL,'2019-01-12 18:39:08.786706','2019-01-12 18:39:08.786737',1,2,NULL,NULL,NULL),(11,'2019-01-14',NULL,'2019-01-14 21:40:14.030268','2019-01-14 21:40:14.030299',1,1,NULL,NULL,NULL),(12,'2019-01-14',NULL,'2019-01-14 21:41:15.298102','2019-01-14 21:41:15.298133',1,1,NULL,NULL,NULL),(13,'2019-01-02',NULL,'2019-01-14 21:43:42.229658','2019-01-14 21:43:42.229688',1,3,NULL,NULL,NULL),(14,'2019-01-04',NULL,'2019-01-14 22:00:15.359658','2019-01-14 22:00:15.359688',1,3,NULL,NULL,NULL),(15,'2019-01-12',NULL,'2019-01-14 22:00:15.367219','2019-01-14 22:00:15.367255',1,3,NULL,NULL,NULL),(16,'2019-01-04',NULL,'2019-01-14 22:00:15.381564','2019-01-14 22:00:15.381605',1,3,NULL,NULL,NULL),(17,'2019-01-16',NULL,'2019-01-18 21:50:29.287839','2019-01-18 21:50:29.287871',1,3,NULL,NULL,NULL),(18,'2019-01-02',NULL,'2019-01-18 21:53:29.358581','2019-01-18 21:53:29.358616',1,1,NULL,NULL,NULL),(19,'2019-01-02',NULL,'2019-01-25 21:36:13.109556','2019-01-25 21:36:13.109591',1,2,NULL,NULL,NULL),(20,'2019-01-02',NULL,'2019-01-25 21:37:59.717099','2019-01-25 21:37:59.717134',1,2,NULL,NULL,NULL),(21,'2019-02-01',NULL,'2019-02-05 16:13:34.425927','2019-02-05 16:13:34.425975',1,1,NULL,1,3),(22,'2019-02-01',NULL,'2019-02-05 16:35:09.871203','2019-02-05 16:35:09.871237',1,1,NULL,1,3);
/*!40000 ALTER TABLE `backend_lote` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_lote_movimiento`
--

DROP TABLE IF EXISTS `backend_lote_movimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_lote_movimiento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lote_id` int NOT NULL,
  `movimientobodega_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `backend_lote_movimiento_lote_id_movimientobodega_bbf18115_uniq` (`lote_id`,`movimientobodega_id`),
  KEY `backend_lote_movimie_movimientobodega_id_ec8e1354_fk_backend_m` (`movimientobodega_id`),
  CONSTRAINT `backend_lote_movimie_movimientobodega_id_ec8e1354_fk_backend_m` FOREIGN KEY (`movimientobodega_id`) REFERENCES `backend_movimientobodega` (`id`),
  CONSTRAINT `backend_lote_movimiento_lote_id_6d90e818_fk_backend_lote_id` FOREIGN KEY (`lote_id`) REFERENCES `backend_lote` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_lote_movimiento`
--

LOCK TABLES `backend_lote_movimiento` WRITE;
/*!40000 ALTER TABLE `backend_lote_movimiento` DISABLE KEYS */;
INSERT INTO `backend_lote_movimiento` VALUES (1,1,1),(6,1,6),(7,1,7),(10,1,10),(13,1,11),(18,1,15),(23,1,20),(41,1,34),(51,1,42),(2,2,2),(5,2,5),(11,2,10),(12,2,11),(25,2,20),(8,5,8),(24,5,20),(9,6,9),(14,7,12),(29,7,22),(15,8,12),(38,8,31),(16,9,13),(30,9,22),(17,10,14),(19,11,16),(31,11,23),(20,12,17),(21,13,18),(22,13,19),(33,13,25),(26,14,21),(27,15,21),(28,16,21),(32,17,24),(34,18,27),(35,18,28),(36,18,29),(39,18,32),(42,18,35),(44,18,37),(37,19,30),(40,20,33),(43,21,36),(45,21,37),(47,21,39),(46,22,38),(48,22,39),(49,22,40),(50,22,41);
/*!40000 ALTER TABLE `backend_lote_movimiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_movimiento`
--

DROP TABLE IF EXISTS `backend_movimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_movimiento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `destino` int DEFAULT NULL,
  `formaPago` int DEFAULT NULL,
  `proveedor_id` int DEFAULT NULL,
  `noDocumento` varchar(140) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `noComprobante` varchar(140) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `concepto` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `depositante` varchar(240) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prestamo` tinyint(1) NOT NULL,
  `monto` double NOT NULL,
  `saldo` double NOT NULL,
  `fecha` date NOT NULL,
  `justificacion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `anulado` tinyint(1) NOT NULL,
  `creado` datetime(6) NOT NULL,
  `modificado` datetime(6) NOT NULL,
  `activo` tinyint(1) NOT NULL,
  `proyecto_id` int DEFAULT NULL,
  `usuario_id` int NOT NULL,
  `comentario` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `categoria_id` int DEFAULT NULL,
  `plazo` int DEFAULT NULL,
  `persona_id` int DEFAULT NULL,
  `vehiculo` varchar(140) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bodega_entrega_id` int DEFAULT NULL,
  `descripcion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `es_oc` tinyint(1) NOT NULL,
  `fecha_entrega` date DEFAULT NULL,
  `ingresado` tinyint(1) NOT NULL,
  `moneda` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pago_automatico` tinyint(1) NOT NULL,
  `pago_completo` tinyint(1) NOT NULL,
  `pendiente_pago` tinyint(1) NOT NULL,
  `orden_id` int DEFAULT NULL,
  `caja_chica` tinyint(1) NOT NULL,
  `numero_oc` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `es_ov` tinyint(1) NOT NULL,
  `despacho_inmediato` tinyint(1) NOT NULL,
  `es_costo` tinyint(1) NOT NULL,
  `linea_id` int DEFAULT NULL,
  `precioUnitario` double NOT NULL,
  `padreCosto_id` int DEFAULT NULL,
  `tiene_compra` tinyint(1) NOT NULL,
  `fecha_inicio_recuperacion` date DEFAULT NULL,
  `fecha_final_recuperacion` date DEFAULT NULL,
  `categoria_recuperacion` int DEFAULT NULL,
  `descuento` double NOT NULL,
  `deposito` tinyint(1) NOT NULL,
  `ventas_ids_id` int DEFAULT NULL,
  `cierre_ventas` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `backend_movimiento_proyecto_id_b3ec82ed_fk_backend_proyecto_id` (`proyecto_id`),
  KEY `backend_movimiento_usuario_id_5ede34a2_fk_backend_usuario_id` (`usuario_id`),
  KEY `backend_movimiento_categoria_id_d0fd3589_fk_backend_c` (`categoria_id`),
  KEY `backend_movimiento_persona_id_3a59c724_fk_backend_usuario_id` (`persona_id`),
  KEY `backend_movimiento_proveedor_id_6b86ad76` (`proveedor_id`),
  KEY `backend_movimiento_bodega_entrega_id_a86a05fe_fk_backend_b` (`bodega_entrega_id`),
  KEY `backend_movimiento_orden_id_84a99d27_fk_backend_movimiento_id` (`orden_id`),
  KEY `backend_movimiento_linea_id_11251215_fk_backend_l` (`linea_id`),
  KEY `backend_movimiento_padreCosto_id_a1bd2a0a_fk_backend_m` (`padreCosto_id`),
  KEY `backend_movimiento_ventas_ids_id_08344503_fk_backend_m` (`ventas_ids_id`),
  CONSTRAINT `backend_movimiento_bodega_entrega_id_a86a05fe_fk_backend_b` FOREIGN KEY (`bodega_entrega_id`) REFERENCES `backend_bodega` (`id`),
  CONSTRAINT `backend_movimiento_categoria_id_d0fd3589_fk_backend_c` FOREIGN KEY (`categoria_id`) REFERENCES `backend_categorias` (`id`),
  CONSTRAINT `backend_movimiento_linea_id_11251215_fk_backend_l` FOREIGN KEY (`linea_id`) REFERENCES `backend_lineaproduccion` (`id`),
  CONSTRAINT `backend_movimiento_orden_id_84a99d27_fk_backend_movimiento_id` FOREIGN KEY (`orden_id`) REFERENCES `backend_movimiento` (`id`),
  CONSTRAINT `backend_movimiento_padreCosto_id_a1bd2a0a_fk_backend_m` FOREIGN KEY (`padreCosto_id`) REFERENCES `backend_movimiento` (`id`),
  CONSTRAINT `backend_movimiento_persona_id_3a59c724_fk_backend_usuario_id` FOREIGN KEY (`persona_id`) REFERENCES `backend_usuario` (`id`),
  CONSTRAINT `backend_movimiento_proveedor_id_6b86ad76_fk_backend_proveedor_id` FOREIGN KEY (`proveedor_id`) REFERENCES `backend_proveedor` (`id`),
  CONSTRAINT `backend_movimiento_proyecto_id_b3ec82ed_fk_backend_proyecto_id` FOREIGN KEY (`proyecto_id`) REFERENCES `backend_proyecto` (`id`),
  CONSTRAINT `backend_movimiento_usuario_id_5ede34a2_fk_backend_usuario_id` FOREIGN KEY (`usuario_id`) REFERENCES `backend_usuario` (`id`),
  CONSTRAINT `backend_movimiento_ventas_ids_id_08344503_fk_backend_m` FOREIGN KEY (`ventas_ids_id`) REFERENCES `backend_movimiento` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=120 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_movimiento`
--

LOCK TABLES `backend_movimiento` WRITE;
/*!40000 ALTER TABLE `backend_movimiento` DISABLE KEYS */;
INSERT INTO `backend_movimiento` VALUES (1,50,30,NULL,'12343',NULL,'Inicial desde Japon','japon',0,342342,0,'2018-10-03',NULL,0,'2018-12-14 21:59:39.025837','2019-01-12 17:35:18.969672',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,NULL,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(2,10,20,NULL,'23424',NULL,'para gastos de gasolina',NULL,0,500,0,'2018-11-14',NULL,0,'2018-12-14 22:02:04.992925','2019-01-12 17:35:18.972282',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,NULL,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(3,20,40,1,'23424','3423','test',NULL,0,200,0,'2018-11-03',NULL,0,'2018-12-14 22:05:20.164855','2019-01-12 17:35:18.975496',1,1,1,NULL,1,3,1,'344',NULL,NULL,0,NULL,0,'GTQ',0,0,0,NULL,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(4,NULL,NULL,1,NULL,NULL,NULL,NULL,0,3240,0,'2018-12-14',NULL,0,'2018-12-14 22:32:23.491574','2019-01-12 17:35:18.977733',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'test',1,NULL,0,'GTQ',1,1,0,NULL,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(5,NULL,40,NULL,NULL,NULL,'Por pago de OC No. 4',NULL,0,0,0,'2018-12-08',NULL,0,'2018-12-14 22:32:23.506649','2018-12-14 22:32:23.506748',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,4,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(6,NULL,NULL,1,NULL,NULL,NULL,NULL,0,3240,0,'2018-12-14',NULL,0,'2018-12-14 22:34:18.494194','2019-01-12 17:35:18.979841',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'test',1,NULL,0,'GTQ',1,1,0,NULL,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(7,NULL,40,NULL,NULL,NULL,'Por pago de OC No. 6',NULL,0,0,0,'2018-11-02',NULL,0,'2018-12-14 22:34:18.503152','2018-12-14 22:34:18.503185',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,6,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(8,10,30,NULL,'342',NULL,'test',NULL,0,5000,0,'2019-01-02',NULL,0,'2019-01-03 15:23:34.368095','2019-01-12 17:35:18.982189',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,NULL,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(9,50,30,NULL,'23424',NULL,'test','japon',0,2000,0,'2019-01-03',NULL,0,'2019-01-03 15:30:47.540651','2019-01-12 17:35:18.986450',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'USD',0,0,0,NULL,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(12,NULL,NULL,1,NULL,NULL,NULL,NULL,0,6000,0,'2019-01-03',NULL,0,'2019-01-03 15:43:00.893053','2019-01-04 22:45:52.242969',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'test',1,NULL,0,'GTQ',0,1,0,NULL,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(13,NULL,40,NULL,'3324','4534','Por pago de OC No. 12',NULL,0,300,0,'2019-01-02',NULL,0,'2019-01-03 15:43:00.898536','2019-01-04 22:45:52.246133',1,1,1,NULL,NULL,12,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,12,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(15,NULL,NULL,1,NULL,NULL,NULL,NULL,0,178004,0,'2019-01-04',NULL,0,'2019-01-04 22:21:59.382860','2019-01-04 23:11:19.144250',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'sdfsfdsdfsdf',1,NULL,1,'GTQ',1,1,0,NULL,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(16,NULL,30,NULL,'23423423','12312','Por pago de OC No. 15',NULL,0,178004,0,'2019-01-17',NULL,0,'2019-01-04 22:21:59.392087','2019-01-04 22:21:59.392121',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,15,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(29,NULL,NULL,1,NULL,NULL,NULL,NULL,0,252,0,'2019-01-04',NULL,0,'2019-01-04 22:23:19.958601','2019-01-04 22:23:19.960504',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'sdfgdfgfdg',1,NULL,0,'GTQ',1,1,0,NULL,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(30,NULL,30,NULL,'123','3','Por pago de OC No. 29',NULL,0,252,0,'2019-01-09',NULL,0,'2019-01-04 22:23:19.964323','2019-01-04 22:23:19.964355',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,29,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(31,NULL,NULL,1,NULL,NULL,NULL,NULL,0,0,0,'2019-01-04',NULL,0,'2019-01-04 22:24:13.045887','2019-01-04 22:24:13.046797',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'eqwe',1,NULL,0,'USD',1,1,0,NULL,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(32,NULL,40,NULL,'23132','34','Por pago de OC No. 31',NULL,0,0,0,'2019-01-02',NULL,0,'2019-01-04 22:24:13.049478','2019-01-04 22:24:13.049511',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'USD',0,0,0,31,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(33,NULL,NULL,1,NULL,NULL,NULL,NULL,0,0,0,'2019-01-04',NULL,0,'2019-01-04 22:25:20.057201','2019-01-04 22:25:20.058279',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'sdfsdf',1,NULL,0,'USD',1,1,0,NULL,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(34,NULL,20,NULL,'3424','324','Por pago de OC No. 33',NULL,0,0,0,'2019-01-10',NULL,0,'2019-01-04 22:25:20.067092','2019-01-04 22:25:20.067137',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'USD',0,0,0,33,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(42,50,30,NULL,'323424',NULL,'sdrfsdfwsdfs','alguien',0,40000,0,'2019-01-11',NULL,0,'2019-01-04 22:32:18.033232','2019-01-12 17:35:18.989547',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'USD',0,0,0,NULL,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(43,NULL,NULL,1,NULL,NULL,NULL,NULL,0,233243,0,'2019-01-04',NULL,0,'2019-01-04 22:33:15.561080','2019-01-04 22:33:15.561127',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'sdfsdf',1,NULL,0,'USD',0,0,0,NULL,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(44,NULL,30,NULL,'3424','23424','Por pago de OC No. 43',NULL,0,20000,0,'2019-01-17',NULL,0,'2019-01-04 22:33:15.566048','2019-01-04 22:33:15.566082',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'USD',0,0,0,43,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(45,NULL,NULL,1,NULL,NULL,NULL,NULL,0,2,0,'2019-01-04',NULL,0,'2019-01-04 22:37:36.444584','2019-01-12 18:23:31.630681',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'sdfsdf',1,NULL,1,'GTQ',0,1,0,NULL,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(46,NULL,NULL,NULL,'2342',NULL,'Por pago de OC No. 45',NULL,0,1,0,'2019-01-01',NULL,0,'2019-01-04 22:39:27.528262','2019-01-04 22:39:27.528294',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,45,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(51,NULL,NULL,1,NULL,NULL,NULL,NULL,0,1100,0,'2019-01-12',NULL,0,'2019-01-12 17:57:55.115722','2019-01-12 17:57:55.115765',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'test de datos',1,NULL,0,'GTQ',0,0,0,NULL,0,'OC-1-00000010',0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(52,NULL,30,NULL,'342','234','Por pago de OC No. OC-1-00000010',NULL,0,23423,0,'2019-01-10',NULL,0,'2019-01-12 17:57:55.125270','2019-01-14 21:33:32.852448',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,51,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(55,NULL,NULL,1,NULL,NULL,NULL,NULL,0,200,0,'2019-01-12',NULL,0,'2019-01-12 17:59:42.029923','2019-01-12 18:39:08.794802',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'erwerw',1,NULL,1,'USD',1,1,0,NULL,0,'OC-1-00000011',0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(56,NULL,30,NULL,'2342','34','Por pago de OC No. OC-1-00000011',NULL,0,200,0,'2019-01-18',NULL,0,'2019-01-12 17:59:42.033935','2019-01-12 17:59:42.033966',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'USD',0,0,0,55,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(58,NULL,NULL,1,NULL,NULL,NULL,NULL,0,100,0,'2019-01-12',NULL,0,'2019-01-12 18:01:36.992709','2019-01-14 21:18:40.361648',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'werwerer',1,NULL,0,'USD',0,1,0,NULL,0,'OC-1-00000012',0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(59,NULL,30,NULL,'34','45','Por pago de OC No. OC-1-00000012',NULL,0,200,0,'2019-01-11','No se pudo procesar la transaccion',1,'2019-01-12 18:01:36.995845','2019-01-14 21:18:40.364578',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'USD',0,0,0,58,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(61,NULL,NULL,2,NULL,NULL,NULL,NULL,0,2,0,'2019-01-12',NULL,0,'2019-01-12 18:17:30.389658','2019-01-12 18:17:30.391688',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'sdfsdf',1,NULL,0,'GTQ',1,1,0,NULL,0,'OC-1-00000013',0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(62,NULL,10,NULL,'2','12','Por pago de OC No. OC-1-00000013',NULL,0,2,0,'2019-01-18',NULL,0,'2019-01-12 18:17:30.396020','2019-01-12 18:17:30.396051',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,61,1,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(65,NULL,NULL,4,NULL,NULL,NULL,NULL,0,2150,0,'2019-01-14',NULL,0,'2019-01-14 21:15:26.458279','2019-01-14 21:41:15.314967',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'compra de materiales',1,NULL,1,'GTQ',1,1,0,NULL,0,'OC-1-00000014',0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(66,NULL,50,NULL,'34234','886','Por pago de OC No. OC-1-00000014',NULL,0,2150,0,'2019-01-10',NULL,0,'2019-01-14 21:15:26.466554','2019-01-14 21:15:26.466585',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,65,1,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(67,NULL,30,NULL,'8','87','Por pago de OC No. OC-1-00000012',NULL,0,50,0,'2019-01-02',NULL,0,'2019-01-14 21:18:40.369494','2019-01-14 21:18:40.369526',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,58,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(68,NULL,NULL,5,NULL,NULL,NULL,NULL,0,500,0,'2019-01-18',NULL,0,'2019-01-18 21:35:52.729698','2019-01-18 21:41:14.544074',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'test',1,NULL,0,'GTQ',0,1,0,NULL,0,'OC-1-00000015',0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(69,NULL,10,NULL,'521',NULL,'Por pago de OC No. OC-1-00000015',NULL,0,50,0,'2019-01-04',NULL,0,'2019-01-18 21:35:52.737481','2019-01-18 21:41:14.546999',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,68,1,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(70,NULL,NULL,2,NULL,NULL,NULL,NULL,0,25,0,'2019-01-18',NULL,0,'2019-01-18 21:36:44.202327','2019-01-18 21:36:44.204021',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'sdfsdf',1,NULL,0,'GTQ',1,1,0,NULL,0,'OC-1-00000016',0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(71,NULL,10,NULL,'748','78757','Por pago de OC No. OC-1-00000016','Tester',0,25,0,'2019-01-12',NULL,0,'2019-01-18 21:36:44.207964','2019-02-05 15:28:26.515026',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,70,1,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(72,NULL,NULL,5,NULL,NULL,NULL,NULL,0,600,0,'2019-01-18',NULL,0,'2019-01-18 21:38:37.605621','2019-02-05 16:06:46.561953',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'ertertert',1,NULL,0,'GTQ',0,1,0,NULL,0,'OC-1-00000017',0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(73,NULL,30,NULL,'4564','456','Por pago de OC No. OC-1-00000017',NULL,0,50,0,'2019-01-02','Confusion',1,'2019-01-18 21:38:37.608597','2019-02-05 16:06:46.565280',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,72,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(74,NULL,30,NULL,'45','745','Por pago de OC No. OC-1-00000015',NULL,0,50,0,'2019-01-03',NULL,0,'2019-01-18 21:41:14.550686','2019-01-18 21:41:14.550718',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'USD',0,0,0,68,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(77,NULL,NULL,2,NULL,NULL,NULL,NULL,0,3600,0,'2019-01-18',NULL,0,'2019-01-18 21:44:55.813701','2019-01-18 21:44:55.819590',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'sdfsdfs',1,NULL,0,'GTQ',1,1,0,NULL,0,'OC-1-00000018',0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(78,NULL,20,NULL,'45645','4','Por pago de OC No. OC-1-00000018',NULL,0,3600,0,'2019-01-16',NULL,0,'2019-01-18 21:44:55.822402','2019-01-18 21:44:55.822435',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,77,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(83,NULL,NULL,2,NULL,NULL,NULL,NULL,0,6846,0,'2019-01-25',NULL,0,'2019-01-25 21:27:33.232801','2019-01-25 21:28:32.529072',1,1,1,NULL,2,NULL,NULL,NULL,NULL,'sdfsfd',1,NULL,0,'GTQ',1,1,0,NULL,0,'OC-1-00000019',0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(84,NULL,30,NULL,'2','5245','Por pago de OC No. OC-1-00000019',NULL,0,6846,0,'2019-01-03',NULL,0,'2019-01-25 21:27:33.237443','2019-01-25 21:48:03.791581',1,1,1,NULL,1,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,83,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(85,NULL,NULL,5,NULL,NULL,NULL,NULL,0,100,0,'2019-01-25',NULL,0,'2019-01-25 21:45:40.147251','2019-01-25 21:45:40.155982',1,1,1,NULL,1,NULL,NULL,NULL,NULL,'sdfsdf',1,NULL,0,'GTQ',1,1,0,NULL,0,'OC-1-00000020',0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(86,NULL,10,NULL,'20',NULL,'Por pago de OC No. OC-1-00000020',NULL,0,100,0,'2019-01-09',NULL,0,'2019-01-25 21:45:40.160960','2019-01-25 21:45:40.160995',1,1,1,NULL,1,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,85,1,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(87,30,40,NULL,'5654',NULL,'test',NULL,1,20000,0,'2019-01-11',NULL,0,'2019-01-25 21:58:41.532859','2019-01-25 21:58:41.532891',1,2,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,NULL,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(88,NULL,NULL,6,NULL,NULL,NULL,NULL,0,300,0,'2019-01-25',NULL,0,'2019-01-25 22:05:14.662741','2022-09-20 18:13:13.516040',1,1,1,NULL,NULL,NULL,NULL,NULL,1,'vendi',0,NULL,1,'GTQ',1,1,0,NULL,0,'OV-1-00000001',1,1,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(89,NULL,10,NULL,'89426',NULL,'Por pago de OV No. OV-1-00000001',NULL,0,300,0,'2019-01-25',NULL,0,'2019-01-25 22:05:14.667196','2019-01-25 22:05:14.667229',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,88,1,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(90,NULL,NULL,6,NULL,NULL,NULL,NULL,0,10000,0,'2019-01-25',NULL,0,'2019-01-25 22:10:22.874034','2019-02-05 16:30:22.345041',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'werwer',0,NULL,1,'GTQ',0,1,0,NULL,0,'OV-1-00000002',1,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(91,NULL,30,NULL,'56','5645','Por pago de OV No. OV-1-00000002',NULL,0,100,0,'2019-01-24',NULL,0,'2019-01-25 22:10:22.877597','2019-01-25 22:10:22.877636',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'USD',0,0,0,90,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(92,NULL,10,NULL,'205',NULL,'Por abono de de OV No. OV-1-00000002',NULL,0,2050,0,'2019-01-24',NULL,0,'2019-01-25 22:16:14.187377','2019-01-25 22:16:14.187411',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,90,1,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(93,NULL,50,NULL,'59193',NULL,'Por depósito de caja de venta de AdminAdmin',NULL,0,2000,0,'2019-01-25',NULL,0,'2019-01-25 22:17:41.681222','2019-01-25 22:17:41.681268',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,NULL,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(94,NULL,10,NULL,'56',NULL,'Por abono de de OV No. OV-1-00000002',NULL,0,500,0,'2019-01-27',NULL,0,'2019-01-25 22:22:02.249315','2019-01-25 22:22:02.249350',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,90,1,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(95,NULL,10,NULL,'45',NULL,'Por abono de de OV No. OV-1-00000002',NULL,0,5000,0,'2019-01-27',NULL,0,'2019-01-25 22:22:02.252885','2019-01-25 22:22:02.252922',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,90,1,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(96,50,30,NULL,'sfsdf',NULL,'por pago de OV de enero','borderless japon',0,50,0,'2019-01-09',NULL,0,'2019-01-25 22:37:22.425269','2019-01-25 22:37:22.425314',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,NULL,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(97,50,20,NULL,'234234234',NULL,'Inicio de Cuenta','Yo mero',0,1000,0,'2019-02-05',NULL,0,'2019-02-05 14:57:04.404882','2019-02-05 14:57:04.404935',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,NULL,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(98,20,20,2,'234234234','234234','Gasolina para Vehiculo',NULL,0,20,0,'2019-02-05',NULL,0,'2019-02-05 14:58:07.881660','2019-02-05 14:58:07.881734',1,1,1,NULL,1,NULL,1,'234234234',NULL,NULL,0,NULL,0,'GTQ',0,0,0,NULL,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(99,20,30,2,'565','651321','sdfsdfsefsdf',NULL,0,200,0,'2019-02-14',NULL,0,'2019-02-05 15:44:24.928412','2019-02-05 15:50:53.621281',1,1,1,NULL,2,12,1,'10',NULL,NULL,0,NULL,0,'GTQ',0,0,0,NULL,0,NULL,0,0,0,NULL,0,NULL,0,'2019-02-01','2020-02-01',159,0,1,NULL,0),(100,NULL,30,NULL,'43545','454','Por pago de OC No. OC-1-00000017',NULL,0,600,0,'2019-02-08',NULL,0,'2019-02-05 16:06:39.536574','2019-02-05 16:06:46.568658',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,72,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(101,NULL,NULL,6,NULL,NULL,NULL,NULL,0,75,0,'2019-02-05',NULL,0,'2019-02-05 16:08:48.030547','2019-02-05 16:13:01.301984',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'test',0,NULL,1,'GTQ',0,1,0,NULL,0,'OV-1-00000003',1,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(102,NULL,30,NULL,'234','234234','Por pago de OV No. OV-1-00000003',NULL,0,20,0,'2019-02-01',NULL,0,'2019-02-05 16:08:48.034168','2019-02-05 16:08:48.034234',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,101,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(103,NULL,20,NULL,'23423','2342','Por abono de de OV No. OV-1-00000003',NULL,0,20,0,'2019-02-07',NULL,0,'2019-02-05 16:09:26.211652','2019-02-05 16:09:26.211689',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,101,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(104,NULL,10,NULL,'123',NULL,'Por abono de de OV No. OV-1-00000003',NULL,0,35,0,'2019-02-14',NULL,0,'2019-02-05 16:10:40.821167','2019-02-05 16:10:40.821203',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,101,1,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(105,NULL,NULL,6,NULL,NULL,NULL,NULL,0,2500,0,'2019-02-05',NULL,0,'2019-02-05 16:33:46.467254','2019-02-05 16:35:29.310378',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'esgfsdf',0,NULL,1,'GTQ',0,0,0,NULL,0,'OV-1-00000004',1,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(106,NULL,NULL,6,NULL,NULL,NULL,NULL,0,125,0,'2019-02-05',NULL,0,'2019-02-05 16:41:12.504590','2022-09-20 18:13:13.517068',1,1,1,NULL,NULL,NULL,NULL,NULL,1,'sdfsdf',0,NULL,1,'GTQ',1,1,0,NULL,0,'OV-1-00000005',1,1,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(107,NULL,10,NULL,'5646',NULL,'Por pago de OV No. OV-1-00000005',NULL,0,125,0,'2019-02-01',NULL,0,'2019-02-05 16:41:12.510549','2019-02-05 16:41:12.510583',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,106,1,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(108,NULL,50,NULL,'158949546',NULL,'Por depósito de caja de venta de AdminAdmin',NULL,0,2350,0,'2019-02-05',NULL,0,'2019-02-05 16:42:44.286529','2019-02-05 16:42:44.286704',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,NULL,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(109,NULL,NULL,6,NULL,NULL,NULL,NULL,0,312,0,'2019-02-05',NULL,0,'2019-02-05 16:45:40.095171','2019-02-05 16:49:09.476775',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'dfgdfgd',0,NULL,0,'GTQ',0,0,0,NULL,0,'OV-1-00000006',1,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(110,NULL,10,NULL,'23423',NULL,'Por abono de de OV No. OV-1-00000006',NULL,0,100,0,'2019-02-03',NULL,0,'2019-02-05 16:49:09.484198','2019-02-05 16:49:09.484263',1,3,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'',0,0,0,109,1,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(111,NULL,50,NULL,'3600',NULL,'Por depósito de caja de venta de AdminAdmin',NULL,0,3660,0,'2019-02-05',NULL,0,'2019-02-05 17:01:29.364333','2019-02-05 17:01:29.364407',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,NULL,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(112,NULL,NULL,7,NULL,NULL,NULL,NULL,0,1.25,0,'2019-03-26',NULL,0,'2019-03-26 16:40:53.940149','2019-03-26 16:40:53.950491',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'ddf',0,NULL,0,'GTQ',1,1,0,NULL,0,'OV-1-00000007',1,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(113,NULL,30,NULL,'12','1','Por pago de OV No. OV-1-00000007',NULL,0,1.25,0,'2019-03-13',NULL,0,'2019-03-26 16:40:53.947660','2019-03-26 16:40:53.947712',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,112,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(114,NULL,NULL,7,NULL,NULL,NULL,NULL,0,60398,0,'2019-05-06',NULL,0,'2019-05-06 16:28:22.337386','2019-05-06 16:28:22.345207',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'dfgdfg',0,NULL,0,'GTQ',1,1,0,NULL,0,'OV-1-00000008',1,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(115,NULL,20,NULL,'23','23','Por pago de OV No. OV-1-00000008',NULL,0,60398,0,'2019-05-08',NULL,0,'2019-05-06 16:28:22.343210','2019-05-06 16:28:22.343241',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,114,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(116,NULL,NULL,7,NULL,NULL,NULL,NULL,0,1.25,0,'2019-05-06',NULL,0,'2019-05-06 16:38:28.380460','2022-09-20 18:13:13.517910',1,1,1,NULL,NULL,NULL,NULL,NULL,1,'afasdf adsf',0,NULL,1,'GTQ',1,1,0,NULL,0,'OV-1-00000009',1,1,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(117,NULL,20,NULL,'15022018','2323','Por pago de OV No. OV-1-00000009',NULL,0,1.25,0,'2019-05-01',NULL,0,'2019-05-06 16:38:28.384942','2019-05-06 16:38:28.384973',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,116,0,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(118,NULL,NULL,7,NULL,NULL,NULL,NULL,0,2,0,'2019-05-06',NULL,0,'2019-05-06 23:27:01.028737','2022-09-20 18:13:13.518790',1,1,1,NULL,NULL,NULL,NULL,NULL,1,'asdfasd ',0,NULL,1,'GTQ',1,1,0,NULL,0,'OV-1-00000010',1,1,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0),(119,NULL,10,NULL,'2323',NULL,'Por pago de OV No. OV-1-00000010',NULL,0,2,0,'2019-05-16',NULL,0,'2019-05-06 23:27:01.033282','2019-05-06 23:27:01.033314',1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,'GTQ',0,0,0,118,1,NULL,0,0,0,NULL,0,NULL,0,NULL,NULL,159,0,1,NULL,0);
/*!40000 ALTER TABLE `backend_movimiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_movimientobodega`
--

DROP TABLE IF EXISTS `backend_movimientobodega`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_movimientobodega` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `tipo` int NOT NULL,
  `creado` datetime(6) NOT NULL,
  `modificado` datetime(6) NOT NULL,
  `activo` tinyint(1) NOT NULL,
  `bodega_id` int NOT NULL,
  `movimiento_id` int DEFAULT NULL,
  `padre_id` int DEFAULT NULL,
  `justificacion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `linea_id` int DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  `justificacionAnulacion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `lote_id` int DEFAULT NULL,
  `entregado` tinyint(1) NOT NULL,
  `destino_id` int DEFAULT NULL,
  `nota` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `empresa_id` int DEFAULT NULL,
  `no_movimiento` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipoDespacho` int DEFAULT NULL,
  `tipoIngreso` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `backend_movimientobodega_bodega_id_a468666e_fk_backend_bodega_id` (`bodega_id`),
  KEY `backend_movimientobo_movimiento_id_d7b3def7_fk_backend_m` (`movimiento_id`),
  KEY `backend_movimientobo_padre_id_3b72dcdc_fk_backend_m` (`padre_id`),
  KEY `backend_movimientobo_linea_id_95c0de32_fk_backend_l` (`linea_id`),
  KEY `backend_movimientobo_usuario_id_d9aa28d6_fk_backend_u` (`usuario_id`),
  KEY `backend_movimientobodega_lote_id_7fb7afbc_fk_backend_lote_id` (`lote_id`),
  KEY `backend_movimientobo_destino_id_01f9e4c9_fk_backend_b` (`destino_id`),
  KEY `backend_movimientobo_empresa_id_a188a131_fk_backend_p` (`empresa_id`),
  CONSTRAINT `backend_movimientobo_destino_id_01f9e4c9_fk_backend_b` FOREIGN KEY (`destino_id`) REFERENCES `backend_bodega` (`id`),
  CONSTRAINT `backend_movimientobo_empresa_id_a188a131_fk_backend_p` FOREIGN KEY (`empresa_id`) REFERENCES `backend_proyecto` (`id`),
  CONSTRAINT `backend_movimientobo_linea_id_95c0de32_fk_backend_l` FOREIGN KEY (`linea_id`) REFERENCES `backend_lineaproduccion` (`id`),
  CONSTRAINT `backend_movimientobo_movimiento_id_d7b3def7_fk_backend_m` FOREIGN KEY (`movimiento_id`) REFERENCES `backend_movimiento` (`id`),
  CONSTRAINT `backend_movimientobo_padre_id_3b72dcdc_fk_backend_m` FOREIGN KEY (`padre_id`) REFERENCES `backend_movimientobodega` (`id`),
  CONSTRAINT `backend_movimientobo_usuario_id_d9aa28d6_fk_backend_u` FOREIGN KEY (`usuario_id`) REFERENCES `backend_usuario` (`id`),
  CONSTRAINT `backend_movimientobodega_bodega_id_a468666e_fk_backend_bodega_id` FOREIGN KEY (`bodega_id`) REFERENCES `backend_bodega` (`id`),
  CONSTRAINT `backend_movimientobodega_lote_id_7fb7afbc_fk_backend_lote_id` FOREIGN KEY (`lote_id`) REFERENCES `backend_lote` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_movimientobodega`
--

LOCK TABLES `backend_movimientobodega` WRITE;
/*!40000 ALTER TABLE `backend_movimientobodega` DISABLE KEYS */;
INSERT INTO `backend_movimientobodega` VALUES (1,'2019-01-04',10,'2019-01-04 22:53:31.554975','2019-01-04 22:53:31.555022',1,1,15,NULL,'Ingreso por orden de compra No. 15',NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL),(2,'2019-01-04',10,'2019-01-04 23:11:19.122762','2019-01-04 23:11:19.122805',1,1,15,NULL,'Ingreso por orden de compra No. 15',NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL),(5,'2019-01-12',40,'2019-01-12 18:20:40.047327','2019-01-12 18:20:40.047370',1,1,NULL,NULL,'Se ha realizado un reajuste y se actualizó de 200 a 300',NULL,NULL,NULL,NULL,0,NULL,'no contaron bien',NULL,NULL,NULL,NULL),(6,'2019-01-12',40,'2019-01-12 18:21:00.897059','2019-01-12 18:21:00.897100',1,1,NULL,NULL,'Se ha realizado un reajuste y se actualizó de 100 a 500',NULL,NULL,NULL,NULL,0,NULL,'wdfsf',NULL,NULL,NULL,NULL),(7,'2019-01-12',40,'2019-01-12 18:21:38.091309','2019-01-12 18:21:38.091351',1,1,NULL,NULL,'Se ha realizado un reajuste y se actualizó de 20 a 1000',NULL,NULL,NULL,NULL,0,NULL,'fsgsf',NULL,NULL,NULL,NULL),(8,'2019-01-12',10,'2019-01-12 18:23:31.618206','2019-01-12 18:23:31.618250',1,1,45,NULL,'Ingreso por orden de compra No. 45',NULL,NULL,NULL,NULL,0,NULL,'Hola  mundo!',NULL,NULL,NULL,NULL),(9,'2019-01-12',10,'2019-01-12 18:25:17.509821','2019-01-12 18:25:17.509864',1,1,NULL,NULL,'Ingreso desde línea de producción.',NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL),(10,'2019-01-12',30,'2019-01-12 18:27:20.769959','2019-01-25 21:30:17.585787',0,1,NULL,NULL,'Despacho hacia línea de producción.',2,NULL,'prueba',NULL,0,NULL,NULL,2,NULL,NULL,NULL),(11,'2019-01-12',30,'2019-01-12 18:31:19.748898','2019-01-12 18:34:35.902401',1,1,NULL,NULL,'Despacho hacia bodega.',NULL,NULL,NULL,NULL,1,2,NULL,NULL,NULL,NULL,NULL),(12,'2019-01-12',10,'2019-01-12 18:34:17.870197','2019-01-12 18:34:17.870239',1,2,NULL,11,'Ingreso desde despacho de bodega.',NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL),(13,'2019-01-12',10,'2019-01-12 18:34:35.885257','2019-01-12 18:34:35.885300',1,2,NULL,11,'Ingreso desde despacho de bodega.',NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL),(14,'2019-01-12',10,'2019-01-12 18:39:08.785849','2019-01-12 18:39:08.785894',1,2,55,NULL,'Ingreso por orden de compra No. 55',NULL,NULL,NULL,NULL,0,NULL,'hola mundo',NULL,NULL,NULL,NULL),(15,'2019-01-14',40,'2019-01-14 21:38:01.070033','2019-01-14 21:38:01.070077',1,1,NULL,NULL,'Se ha realizado un reajuste y se actualizó de 32 a 60',NULL,NULL,NULL,NULL,0,NULL,'porque no se habia contado bien',NULL,NULL,NULL,NULL),(16,'2019-01-14',10,'2019-01-14 21:40:14.029414','2019-01-14 21:40:14.029457',1,1,65,NULL,'Ingreso por orden de compra No. 65',NULL,1,NULL,NULL,0,NULL,'primera entrega, van a entregar mas otro dia',NULL,'OI-1-00000005',NULL,NULL),(17,'2019-01-14',10,'2019-01-14 21:41:15.296542','2019-01-14 21:41:15.296583',1,1,65,NULL,'Ingreso por orden de compra No. 65',NULL,1,NULL,NULL,0,NULL,NULL,NULL,'OI-1-00000006',NULL,NULL),(18,'2019-01-14',10,'2019-01-14 21:43:42.228828','2019-01-14 21:43:42.228870',1,3,NULL,NULL,'Ingreso desde línea de producción.',NULL,1,NULL,NULL,0,NULL,NULL,NULL,'OI-3-00000001',NULL,NULL),(19,'2019-01-02',30,'2019-01-14 21:47:32.503287','2019-01-14 21:47:32.518463',1,3,NULL,NULL,'Despacho hacia línea de producción.',1,1,NULL,NULL,0,NULL,NULL,2,'OD-3-00000001',NULL,NULL),(20,'2019-01-04',30,'2019-01-14 21:59:15.013414','2019-01-14 22:00:15.388530',1,1,NULL,NULL,'Despacho hacia bodega.',NULL,1,NULL,NULL,1,3,NULL,NULL,'OD-1-00000003',NULL,NULL),(21,'2019-01-14',10,'2019-01-14 22:00:15.355635','2019-01-14 22:00:15.355676',1,3,NULL,20,'Ingreso desde despacho de bodega.',NULL,1,NULL,NULL,0,NULL,NULL,NULL,'OI-3-00000002',NULL,NULL),(22,'2019-01-03',30,'2019-01-14 22:04:06.923751','2019-01-14 22:04:06.939540',1,2,NULL,NULL,'Despacho hacia bodega.',NULL,1,NULL,NULL,0,1,NULL,NULL,'OD-2-00000001',NULL,NULL),(23,'2019-01-18',40,'2019-01-18 21:47:50.064453','2019-01-18 21:47:50.064498',1,1,NULL,NULL,'Se ha realizado un reajuste y se actualizó de 250 a 500',NULL,NULL,NULL,NULL,0,NULL,'no se vendieron',NULL,NULL,NULL,NULL),(24,'2019-01-18',10,'2019-01-18 21:50:29.286609','2019-01-18 21:50:29.286653',1,3,NULL,NULL,'Ingreso desde línea de producción.',NULL,1,NULL,NULL,0,NULL,NULL,NULL,'OI-3-00000003',NULL,NULL),(25,'2019-01-10',30,'2019-01-18 21:52:52.454535','2019-01-18 21:53:29.365259',1,3,NULL,NULL,'Despacho hacia bodega.',NULL,1,NULL,NULL,1,1,NULL,NULL,'OD-3-00000002',NULL,NULL),(27,'2019-01-18',10,'2019-01-18 21:53:29.353634','2019-01-18 21:53:29.353677',1,1,NULL,25,'Ingreso desde despacho de bodega.',NULL,1,NULL,NULL,0,NULL,'entregado',NULL,'OI-1-00000007',NULL,NULL),(28,'2019-01-17',30,'2019-01-25 21:31:04.809139','2019-01-25 21:36:13.114766',1,1,NULL,NULL,'Despacho hacia bodega.',NULL,1,NULL,NULL,1,2,NULL,NULL,'OD-1-00000004',NULL,NULL),(29,'2019-01-18',30,'2019-01-25 21:32:39.881883','2019-01-25 21:50:04.575556',0,1,NULL,NULL,'Despacho hacia línea de producción.',3,1,'Hola mundo',NULL,0,NULL,NULL,1,'OD-1-00000005',NULL,NULL),(30,'2019-01-25',10,'2019-01-25 21:36:13.104925','2019-01-25 21:36:13.104968',1,2,NULL,28,'Ingreso desde despacho de bodega.',NULL,1,NULL,NULL,0,NULL,'se quebraron 5',NULL,'OI-2-00000004',NULL,NULL),(31,'2019-01-25',40,'2019-01-25 21:36:40.819558','2019-01-25 21:36:40.819603',1,2,NULL,NULL,'Se ha realizado un reajuste y se actualizó de 30 a 0',NULL,NULL,NULL,NULL,0,NULL,'estos ya no existen',NULL,NULL,NULL,NULL),(32,'2019-01-04',30,'2019-01-25 21:37:37.072465','2019-01-25 21:37:59.724630',1,1,NULL,NULL,'Despacho hacia bodega.',NULL,1,NULL,NULL,1,2,NULL,NULL,'OD-1-00000006',NULL,NULL),(33,'2019-01-25',10,'2019-01-25 21:37:59.708383','2019-01-25 21:37:59.708428',1,2,NULL,32,'Ingreso desde despacho de bodega.',NULL,1,NULL,NULL,0,NULL,NULL,NULL,'OI-2-00000005',NULL,NULL),(34,'2019-01-25',30,'2019-01-25 22:05:14.687028','2019-01-25 22:05:14.697093',1,1,88,NULL,'Despacho por OV No. OV-1-00000001',NULL,1,NULL,NULL,0,NULL,NULL,1,'OD-Maysol Huitan-00000007',NULL,NULL),(35,'2019-02-05',30,'2019-02-05 16:13:01.276512','2019-02-05 16:13:01.288628',1,1,101,NULL,'solo se entrego un carton',NULL,1,NULL,NULL,0,NULL,NULL,1,'OD-Maysol Huitan-00000008',20,NULL),(36,'2019-02-05',10,'2019-02-05 16:13:34.424616','2019-02-05 16:13:34.424684',1,1,NULL,NULL,'Ingreso desde línea de producción.',3,1,NULL,NULL,0,NULL,NULL,1,'OI-1-00000008',NULL,10),(37,'2019-02-05',30,'2019-02-05 16:30:22.316974','2019-02-05 16:30:22.337113',1,1,90,NULL,'Despacho por orden de venta No. OV-1-00000002',NULL,1,NULL,NULL,0,NULL,NULL,1,'OD-Maysol Huitan-00000009',20,NULL),(38,'2019-02-05',10,'2019-02-05 16:35:09.870127','2019-02-05 16:35:09.870177',1,1,NULL,NULL,'Ingreso desde línea de producción.',3,1,NULL,NULL,0,NULL,NULL,1,'OI-1-00000009',NULL,10),(39,'2019-02-05',30,'2019-02-05 16:35:29.280074','2019-02-05 16:35:29.302410',1,1,105,NULL,'Despacho por orden de venta No. OV-1-00000004',NULL,1,NULL,NULL,0,NULL,NULL,1,'OD-Maysol Huitan-00000010',20,NULL),(40,'2019-02-05',30,'2019-02-05 16:41:12.528097','2019-02-05 16:41:12.538475',1,1,106,NULL,'Despacho por OV No. OV-1-00000005',NULL,1,NULL,NULL,1,NULL,NULL,1,'OD-Maysol Huitan-00000011',NULL,NULL),(41,'2019-05-06',30,'2019-05-06 16:38:28.404983','2019-05-06 16:38:28.421338',1,1,116,NULL,'Despacho por OV No. OV-1-00000009',NULL,1,NULL,NULL,1,NULL,NULL,1,'OD-Maysol Huitan-00000012',NULL,NULL),(42,'2019-05-06',30,'2019-05-06 23:27:01.051654','2019-05-06 23:27:01.064936',1,1,118,NULL,'Despacho por OV No. OV-1-00000010',NULL,1,NULL,NULL,1,NULL,NULL,1,'OD-Maysol Huitan-00000013',NULL,NULL);
/*!40000 ALTER TABLE `backend_movimientobodega` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_movimientogranja`
--

DROP TABLE IF EXISTS `backend_movimientogranja`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_movimientogranja` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cantidad_gallinas` int DEFAULT NULL,
  `raza` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `edad` int DEFAULT NULL,
  `peso_gallinas` tinyint(1) NOT NULL,
  `promedio` double DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `justificacion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `nota` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `creado` datetime(6) NOT NULL,
  `modificado` datetime(6) NOT NULL,
  `activo` tinyint(1) NOT NULL,
  `gallinero_id` int NOT NULL,
  `responsable_id` int DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  `hora` time(6) DEFAULT NULL,
  `insumos` double DEFAULT NULL,
  `medicina` double DEFAULT NULL,
  `porcion_agua` double DEFAULT NULL,
  `porcion_alimento` double DEFAULT NULL,
  `precio_carton` double DEFAULT NULL,
  `precio_concentrado` double DEFAULT NULL,
  `salario` double DEFAULT NULL,
  `posturaG` double DEFAULT NULL,
  `edad_inicial` int DEFAULT NULL,
  `fecha_inicial` date DEFAULT NULL,
  `produccion` double DEFAULT NULL,
  `rentabilidad` double DEFAULT NULL,
  `venta` double DEFAULT NULL,
  `postura` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `backend_movimientogr_gallinero_id_1d395e5a_fk_backend_p` (`gallinero_id`),
  KEY `backend_movimientogr_responsable_id_1abe4bd2_fk_backend_u` (`responsable_id`),
  KEY `backend_movimientogr_usuario_id_eef3a2c8_fk_backend_u` (`usuario_id`),
  CONSTRAINT `backend_movimientogr_gallinero_id_1d395e5a_fk_backend_p` FOREIGN KEY (`gallinero_id`) REFERENCES `backend_proyecto` (`id`),
  CONSTRAINT `backend_movimientogr_responsable_id_1abe4bd2_fk_backend_u` FOREIGN KEY (`responsable_id`) REFERENCES `backend_usuario` (`id`),
  CONSTRAINT `backend_movimientogr_usuario_id_eef3a2c8_fk_backend_u` FOREIGN KEY (`usuario_id`) REFERENCES `backend_usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_movimientogranja`
--

LOCK TABLES `backend_movimientogranja` WRITE;
/*!40000 ALTER TABLE `backend_movimientogranja` DISABLE KEYS */;
INSERT INTO `backend_movimientogranja` VALUES (1,200,'Hyline',18,0,NULL,'2019-01-01','inicial',NULL,'2019-01-18 22:02:36.787580','2019-01-18 22:02:36.790016',1,4,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,199,'Hyline',19,0,NULL,'2019-01-04','una gallina se perdio',NULL,'2019-01-18 22:04:15.978954','2019-01-18 22:04:15.980168',1,4,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,199,'Hyline',19,1,2.61888888888889,'2019-01-18',NULL,'dfsdf','2019-01-18 22:06:15.086908','2019-01-18 22:06:15.087582',1,4,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,199,'Hyline',NULL,1,2.475,'2019-01-17',NULL,'test','2019-01-25 21:41:08.633613','2019-01-25 21:41:08.634686',1,4,NULL,1,'12:30:00.000000',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(5,199,'Hyline',NULL,1,2.1,'2019-01-03',NULL,'sfsfd','2019-01-25 21:41:34.478478','2019-01-25 21:41:34.481134',1,4,NULL,1,'18:50:00.000000',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(6,200,'Hyline',18,0,2.1,'2019-01-18','Nuevo lote de gallinas',NULL,'2019-01-25 21:52:55.448353','2019-01-25 21:52:55.449043',1,4,NULL,1,'15:54:00.000000',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `backend_movimientogranja` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_permiso`
--

DROP TABLE IF EXISTS `backend_permiso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_permiso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `administrador` tinyint(1) NOT NULL,
  `backoffice` tinyint(1) NOT NULL,
  `supervisor` tinyint(1) NOT NULL,
  `vendedor` tinyint(1) NOT NULL,
  `bodeguero` tinyint(1) NOT NULL,
  `compras` tinyint(1) NOT NULL,
  `sin_acceso` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_permiso`
--

LOCK TABLES `backend_permiso` WRITE;
/*!40000 ALTER TABLE `backend_permiso` DISABLE KEYS */;
INSERT INTO `backend_permiso` VALUES (1,1,1,1,1,1,1,0),(2,0,0,0,1,1,0,0),(3,0,0,1,0,0,0,0),(4,0,0,0,1,0,0,0),(5,1,0,0,0,0,0,0),(6,0,0,0,1,1,0,0);
/*!40000 ALTER TABLE `backend_permiso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_preciofraccion`
--

DROP TABLE IF EXISTS `backend_preciofraccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_preciofraccion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `moneda` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `precio` double NOT NULL,
  `activo` tinyint(1) NOT NULL,
  `stock_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `backend_preciofraccion_stock_id_b02ec56d_fk_backend_fraccion_id` (`stock_id`),
  CONSTRAINT `backend_preciofraccion_stock_id_b02ec56d_fk_backend_fraccion_id` FOREIGN KEY (`stock_id`) REFERENCES `backend_fraccion` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_preciofraccion`
--

LOCK TABLES `backend_preciofraccion` WRITE;
/*!40000 ALTER TABLE `backend_preciofraccion` DISABLE KEYS */;
INSERT INTO `backend_preciofraccion` VALUES (1,'GTQ',1.25,1,1),(2,'GTQ',1.25,1,1),(3,'GTQ',1,1,1),(4,'GTQ',1,1,5),(5,'GTQ',100,1,14),(6,'GTQ',100,1,14),(7,'GTQ',100,1,14),(8,'USD',12,1,14),(9,'USD',10,1,14),(10,'USD',10,1,14),(11,'GTQ',25,1,2),(12,'GTQ',26,1,6),(13,'GTQ',25,1,6),(14,'GTQ',24,1,6),(15,'GTQ',500,1,11);
/*!40000 ALTER TABLE `backend_preciofraccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_producto`
--

DROP TABLE IF EXISTS `backend_producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_producto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `vendible` tinyint(1) NOT NULL,
  `activo` tinyint(1) NOT NULL,
  `creado` datetime(6) NOT NULL,
  `modificado` datetime(6) NOT NULL,
  `empresa_id` int NOT NULL,
  `multiplos` tinyint(1) NOT NULL,
  `moneda` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `porcentaje` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `backend_producto_empresa_id_39f803a1_fk_backend_proyecto_id` (`empresa_id`),
  CONSTRAINT `backend_producto_empresa_id_39f803a1_fk_backend_proyecto_id` FOREIGN KEY (`empresa_id`) REFERENCES `backend_proyecto` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_producto`
--

LOCK TABLES `backend_producto` WRITE;
/*!40000 ALTER TABLE `backend_producto` DISABLE KEYS */;
INSERT INTO `backend_producto` VALUES (1,'Huevos',NULL,1,1,'2018-12-14 22:11:32.228525','2019-02-05 16:37:39.193620',1,1,'GTQ',NULL),(2,'block',NULL,0,1,'2018-12-14 22:23:46.316732','2018-12-14 22:23:46.316787',1,0,'GTQ',NULL),(3,'madera',NULL,0,1,'2018-12-14 22:24:12.151216','2018-12-14 22:24:12.151264',1,0,'GTQ',NULL),(4,'Huevo Jumbo',NULL,1,1,'2019-01-03 15:26:25.171783','2019-01-03 15:26:25.171836',1,1,'GTQ',NULL),(8,'test','',0,1,'2019-01-12 17:57:55.116840','2019-01-12 17:57:55.118003',1,0,'GTQ',NULL),(10,'tela','',0,1,'2019-01-18 21:44:55.814774','2019-01-18 21:44:55.815512',1,0,'GTQ',NULL),(11,'Faldas',NULL,1,1,'2019-02-05 16:28:38.142442','2019-02-05 16:28:38.142498',2,0,'GTQ',50);
/*!40000 ALTER TABLE `backend_producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_proveedor`
--

DROP TABLE IF EXISTS `backend_proveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_proveedor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nit` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `codigo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `correo_caja` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `creado` datetime(6) NOT NULL,
  `modificado` datetime(6) NOT NULL,
  `activo` tinyint(1) NOT NULL,
  `empresa_id` int DEFAULT NULL,
  `es_cliente` tinyint(1) NOT NULL,
  `descripcion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `direccion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `backend_proveedor_empresa_id_23c0c912_fk_backend_proyecto_id` (`empresa_id`),
  CONSTRAINT `backend_proveedor_empresa_id_23c0c912_fk_backend_proyecto_id` FOREIGN KEY (`empresa_id`) REFERENCES `backend_proyecto` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_proveedor`
--

LOCK TABLES `backend_proveedor` WRITE;
/*!40000 ALTER TABLE `backend_proveedor` DISABLE KEYS */;
INSERT INTO `backend_proveedor` VALUES (1,'Puma','3423423','3434',NULL,'2018-12-14 22:04:41.894126','2018-12-14 22:04:41.894176',1,1,0,NULL,NULL),(2,'Yorch inc',NULL,NULL,NULL,'2019-01-12 18:17:30.386410','2019-01-12 18:17:30.386462',1,1,0,NULL,NULL),(4,'Ferreteria el nuevo mundo',NULL,NULL,NULL,'2019-01-14 21:15:26.455040','2019-01-14 21:15:26.455090',1,1,0,NULL,NULL),(5,'nuevo proveedor',NULL,NULL,NULL,'2019-01-18 21:35:52.721454','2019-01-18 21:35:52.721507',1,1,0,NULL,NULL),(6,'Yorch De La Cruz',NULL,NULL,NULL,'2019-01-25 22:05:14.659187','2019-01-25 22:05:14.659238',1,NULL,1,NULL,NULL),(7,'Iglesia Enseñanza Agua Viva','439937-4','1','guiuselamp21@yahoo.com','2019-02-08 23:37:31.027689','2019-02-08 23:37:31.027744',1,3,1,NULL,NULL);
/*!40000 ALTER TABLE `backend_proveedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_proyecto`
--

DROP TABLE IF EXISTS `backend_proyecto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_proyecto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(140) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `representante` varchar(140) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `fase` int NOT NULL,
  `activo` tinyint(1) NOT NULL,
  `empresa_id` int DEFAULT NULL,
  `subempresa` tinyint(1) NOT NULL,
  `es_gallinero` tinyint(1) NOT NULL,
  `tecnico_id` int DEFAULT NULL,
  `cantidad_agua` double DEFAULT NULL,
  `cantidad_alimento` double DEFAULT NULL,
  `direccion` varchar(140) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fechaInicio` date DEFAULT NULL,
  `fechaFinal` date DEFAULT NULL,
  `monto` double DEFAULT NULL,
  `plazo` int DEFAULT NULL,
  `fecha_inicio_costo` date DEFAULT NULL,
  `categoria_recuperacion` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `backend_proyecto_empresa_id_d3b621ad_fk_backend_proyecto_id` (`empresa_id`),
  KEY `backend_proyecto_tecnico_id_23e973c2_fk_backend_usuario_id` (`tecnico_id`),
  CONSTRAINT `backend_proyecto_empresa_id_d3b621ad_fk_backend_proyecto_id` FOREIGN KEY (`empresa_id`) REFERENCES `backend_proyecto` (`id`),
  CONSTRAINT `backend_proyecto_tecnico_id_23e973c2_fk_backend_usuario_id` FOREIGN KEY (`tecnico_id`) REFERENCES `backend_usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_proyecto`
--

LOCK TABLES `backend_proyecto` WRITE;
/*!40000 ALTER TABLE `backend_proyecto` DISABLE KEYS */;
INSERT INTO `backend_proyecto` VALUES (1,'Borderless','Borderless',20,1,NULL,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,159),(2,'Iloito','erwer',20,1,NULL,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,159),(3,'Maysol','Antonio Mayen',20,1,NULL,0,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,159),(4,'Huitan 1','YorchdlaCruz',20,1,3,1,1,2,0.5,330,NULL,NULL,NULL,'2020-01-01',20000,12,'2019-01-01',159),(5,'Huitan 2','test',20,1,3,1,1,2,NULL,NULL,NULL,NULL,NULL,'2021-02-01',50000,24,'2019-02-01',159);
/*!40000 ALTER TABLE `backend_proyecto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_usuario`
--

DROP TABLE IF EXISTS `backend_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(254) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `telefono` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` varchar(240) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cajachica_id` int NOT NULL,
  `proyecto_id` int NOT NULL,
  `puestos` int NOT NULL,
  `accesos_id` int DEFAULT NULL,
  `caja_venta_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `cajachica_id` (`cajachica_id`),
  UNIQUE KEY `caja_venta_id` (`caja_venta_id`),
  UNIQUE KEY `accesos_id` (`accesos_id`),
  KEY `backend_usuario_proyecto_id_f64ecc7d_fk_backend_proyecto_id` (`proyecto_id`),
  CONSTRAINT `backend_usuario_accesos_id_620a01dd_fk_backend_permiso_id` FOREIGN KEY (`accesos_id`) REFERENCES `backend_permiso` (`id`),
  CONSTRAINT `backend_usuario_caja_venta_id_690459d9_fk_backend_cuenta_id` FOREIGN KEY (`caja_venta_id`) REFERENCES `backend_cuenta` (`id`),
  CONSTRAINT `backend_usuario_cajachica_id_6ce99f30_fk_backend_cuenta_id` FOREIGN KEY (`cajachica_id`) REFERENCES `backend_cuenta` (`id`),
  CONSTRAINT `backend_usuario_proyecto_id_f64ecc7d_fk_backend_proyecto_id` FOREIGN KEY (`proyecto_id`) REFERENCES `backend_proyecto` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_usuario`
--

LOCK TABLES `backend_usuario` WRITE;
/*!40000 ALTER TABLE `backend_usuario` DISABLE KEYS */;
INSERT INTO `backend_usuario` VALUES (1,'pbkdf2_sha256$150000$ORDJOkBk9AhP$0EZCAFcQI5DdoL4uXJx16AXBzrtG6sbNvusJsnYYoz0=','2018-12-14 21:55:18.000000',1,'admin','Admin','Admin','',1,1,'2018-12-14 21:54:35.000000','77889944',NULL,1,1,100,5,10),(2,'pbkdf2_sha256$150000$kx0TaA0Yc8Az$l0nupLpwBbLT1IFbIIK/EMyHVsi9IE0CNSWE0eHWrv8=',NULL,0,'yorch','Yorch ','Rosales','test@test.com',0,1,'2018-12-14 22:22:29.282833','3849982',NULL,5,2,80,2,11),(3,'pbkdf2_sha256$150000$dd7g7NeLQBGS$0oizWcCyZCtD6YAB9qTbVg5g3uChF4WWTc9fJYLbmAg=',NULL,0,'carlos123','Carlos Prueba','Test','',0,1,'2019-01-21 18:34:54.701063','12345678',NULL,9,3,80,3,12),(4,'pbkdf2_sha256$150000$4J0fUmMe2Ciw$js7sTN+oIbLG9Tvv+whNfcSl7FJmnPQ61kfAOlf0BM4=',NULL,0,'test4','sdfsdf','sdfsdf','test4@gmail.com',0,1,'2019-01-25 23:01:13.379444','324234',NULL,14,2,80,4,15),(5,'pbkdf2_sha256$150000$QY3isc9jQ3aI$pT0xtun7iiRxMLE5UGEge2H/CFMzcr2rohqlGx/q17Y=',NULL,0,'vendedor','Prueba','Vendedor','test@cian.com',0,1,'2019-02-05 16:47:56.454034','2393493',NULL,17,3,80,6,18);
/*!40000 ALTER TABLE `backend_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_usuario_groups`
--

DROP TABLE IF EXISTS `backend_usuario_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_usuario_groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `backend_usuario_groups_usuario_id_group_id_7642ca9b_uniq` (`usuario_id`,`group_id`),
  KEY `backend_usuario_groups_group_id_b49e283b_fk_auth_group_id` (`group_id`),
  CONSTRAINT `backend_usuario_groups_group_id_b49e283b_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `backend_usuario_groups_usuario_id_82c24056_fk_backend_usuario_id` FOREIGN KEY (`usuario_id`) REFERENCES `backend_usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_usuario_groups`
--

LOCK TABLES `backend_usuario_groups` WRITE;
/*!40000 ALTER TABLE `backend_usuario_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `backend_usuario_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_usuario_user_permissions`
--

DROP TABLE IF EXISTS `backend_usuario_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_usuario_user_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `backend_usuario_user_per_usuario_id_permission_id_ac1e04c2_uniq` (`usuario_id`,`permission_id`),
  KEY `backend_usuario_user_permission_id_092516d9_fk_auth_perm` (`permission_id`),
  CONSTRAINT `backend_usuario_user_permission_id_092516d9_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `backend_usuario_user_usuario_id_9d9836ee_fk_backend_u` FOREIGN KEY (`usuario_id`) REFERENCES `backend_usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_usuario_user_permissions`
--

LOCK TABLES `backend_usuario_user_permissions` WRITE;
/*!40000 ALTER TABLE `backend_usuario_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `backend_usuario_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `object_repr` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_backend_usuario_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_backend_usuario_id` FOREIGN KEY (`user_id`) REFERENCES `backend_usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (1,'2018-12-14 21:55:33.582537','1','Permiso object',1,'[{\"added\": {}}]',20,1),(2,'2018-12-14 21:55:51.358386','1','admin',2,'[{\"changed\": {\"fields\": [\"accesos\"]}}]',7,1);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(3,'auth','group'),(2,'auth','permission'),(6,'authtoken','token'),(8,'backend','afectados'),(14,'backend','bodega'),(30,'backend','cambiomoneda'),(13,'backend','categorias'),(9,'backend','cierre'),(29,'backend','cliente'),(15,'backend','contactoproveedor'),(10,'backend','cuenta'),(16,'backend','cuentaproveedor'),(22,'backend','detallemovbodega'),(27,'backend','detallemovgranja'),(21,'backend','detallemovimiento'),(18,'backend','fraccion'),(26,'backend','inventario'),(24,'backend','lineaproduccion'),(25,'backend','lote'),(11,'backend','movimiento'),(23,'backend','movimientobodega'),(28,'backend','movimientogranja'),(20,'backend','permiso'),(31,'backend','preciofraccion'),(19,'backend','producto'),(17,'backend','proveedor'),(12,'backend','proyecto'),(7,'backend','usuario'),(4,'contenttypes','contenttype'),(5,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=177 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2018-12-14 21:54:34.664253'),(2,'contenttypes','0002_remove_content_type_name','2018-12-14 21:54:34.718570'),(3,'auth','0001_initial','2018-12-14 21:54:34.891287'),(4,'auth','0002_alter_permission_name_max_length','2018-12-14 21:54:34.926500'),(5,'auth','0003_alter_user_email_max_length','2018-12-14 21:54:34.935808'),(6,'auth','0004_alter_user_username_opts','2018-12-14 21:54:34.950276'),(7,'auth','0005_alter_user_last_login_null','2018-12-14 21:54:34.962478'),(8,'auth','0006_require_contenttypes_0002','2018-12-14 21:54:34.967429'),(9,'auth','0007_alter_validators_add_error_messages','2018-12-14 21:54:34.979146'),(10,'auth','0008_alter_user_username_max_length','2018-12-14 21:54:34.997300'),(11,'backend','0001_initial','2018-12-14 21:54:35.655758'),(12,'admin','0001_initial','2018-12-14 21:54:35.755146'),(13,'admin','0002_logentry_remove_auto_add','2018-12-14 21:54:35.785020'),(14,'authtoken','0001_initial','2018-12-14 21:54:35.829597'),(15,'authtoken','0002_auto_20160226_1747','2018-12-14 21:54:35.921338'),(16,'backend','0002_auto_20181029_0354','2018-12-14 21:54:35.985253'),(17,'backend','0003_auto_20181030_1515','2018-12-14 21:54:36.079346'),(18,'backend','0004_cierre_descripcion','2018-12-14 21:54:36.113529'),(19,'backend','0005_auto_20181101_1457','2018-12-14 21:54:36.130182'),(20,'backend','0006_auto_20181103_1603','2018-12-14 21:54:36.145937'),(21,'backend','0007_cierre_archivo','2018-12-14 21:54:36.179357'),(22,'backend','0008_cierre_usuariocierre','2018-12-14 21:54:36.242630'),(23,'backend','0009_cierre_ext','2018-12-14 21:54:36.275879'),(24,'backend','0010_auto_20181113_0216','2018-12-14 21:54:36.293147'),(25,'backend','0011_auto_20181114_1650','2018-12-14 21:54:36.312638'),(26,'backend','0012_auto_20181114_1854','2018-12-14 21:54:36.412778'),(27,'backend','0013_auto_20181116_1510','2018-12-14 21:54:36.450489'),(28,'backend','0014_proyecto_empresa','2018-12-14 21:54:36.529084'),(29,'backend','0015_proyecto_subempresa','2018-12-14 21:54:36.581332'),(30,'backend','0016_auto_20181121_0341','2018-12-14 21:54:36.596236'),(31,'backend','0017_auto_20181121_1909','2018-12-14 21:54:36.617973'),(32,'backend','0018_auto_20181122_1825','2018-12-14 21:54:36.678106'),(33,'backend','0019_auto_20181122_1827','2018-12-14 21:54:36.724776'),(34,'backend','0020_cierre_fechacierre','2018-12-14 21:54:36.753509'),(35,'backend','0021_movimiento_plazo','2018-12-14 21:54:36.789582'),(36,'backend','0022_auto_20181201_1747','2018-12-14 21:54:36.891307'),(37,'backend','0023_bodega','2018-12-14 21:54:36.957444'),(38,'backend','0024_auto_20181203_1939','2018-12-14 21:54:37.059752'),(39,'backend','0025_proveedor_empresa','2018-12-14 21:54:37.105883'),(40,'backend','0026_auto_20181205_2145','2018-12-14 21:54:37.252012'),(41,'backend','0027_auto_20181205_2332','2018-12-14 21:54:37.324406'),(42,'backend','0028_auto_20181205_2339','2018-12-14 21:54:37.355711'),(43,'backend','0029_auto_20181205_2354','2018-12-14 21:54:37.372025'),(44,'backend','0030_auto_20181210_1700','2018-12-14 21:54:37.446688'),(45,'backend','0031_auto_20181210_1736','2018-12-14 21:54:37.529745'),(46,'backend','0032_cuenta_moneda','2018-12-14 21:54:37.585162'),(47,'backend','0033_auto_20181211_0003','2018-12-14 21:54:37.601591'),(48,'backend','0034_auto_20181211_2300','2018-12-14 21:54:37.672031'),(49,'backend','0035_auto_20181211_2305','2018-12-14 21:54:37.790480'),(50,'backend','0036_auto_20181211_2316','2018-12-14 21:54:37.993931'),(51,'backend','0037_auto_20181212_1802','2018-12-14 21:54:38.027132'),(52,'backend','0034_producto_moneda','2018-12-14 21:54:38.060359'),(53,'backend','0038_merge_20181213_1553','2018-12-14 21:54:38.062770'),(54,'backend','0039_auto_20181213_1610','2018-12-14 21:54:38.496198'),(55,'backend','0040_detallemovimiento','2018-12-14 21:54:38.554849'),(56,'backend','0041_auto_20181213_1930','2018-12-14 21:54:38.669474'),(57,'sessions','0001_initial','2018-12-14 21:54:38.685173'),(58,'backend','0041_auto_20181213_1851','2018-12-21 20:58:26.816968'),(59,'backend','0042_auto_20181213_1919','2018-12-21 20:58:26.847658'),(60,'backend','0043_auto_20181213_2108','2018-12-21 20:58:26.922685'),(61,'backend','0044_auto_20181214_0404','2018-12-21 20:58:26.987680'),(62,'backend','0045_movimientobodega_padre','2018-12-21 20:58:27.093431'),(63,'backend','0046_auto_20181214_1747','2018-12-21 20:58:27.117916'),(64,'backend','0047_movimientobodega_justificacion','2018-12-21 20:58:27.162668'),(65,'backend','0048_auto_20181215_1610','2018-12-21 20:58:27.311341'),(66,'backend','0049_merge_20181215_1615','2018-12-21 20:58:27.314802'),(67,'backend','0050_lineaproduccion','2018-12-21 20:58:27.372999'),(68,'backend','0051_auto_20181217_1937','2018-12-21 20:58:27.518339'),(69,'backend','0052_auto_20181218_1832','2018-12-21 20:58:27.974992'),(70,'backend','0053_movimientobodega_justificacionanulacion','2018-12-21 20:58:28.028324'),(71,'backend','0054_movimientobodega_lote','2018-12-21 20:58:28.119978'),(72,'backend','0055_movimientobodega_entregado','2018-12-21 20:58:28.173347'),(73,'backend','0056_detallemovbodega_movimiento','2018-12-21 20:58:28.250332'),(74,'backend','0057_auto_20181219_1903','2018-12-21 20:58:28.430878'),(75,'backend','0058_auto_20181220_1532','2018-12-21 20:58:28.589410'),(76,'backend','0059_movimientobodega_destino','2018-12-21 20:58:28.662327'),(77,'backend','0060_detallemovimiento_cantidadactual','2019-01-04 21:26:52.529648'),(78,'backend','0061_remove_lote_vencimiento','2019-01-04 21:26:52.579835'),(79,'backend','0062_inventario','2019-01-04 21:26:52.683145'),(80,'backend','0063_movimientobodega_nota','2019-01-12 17:35:18.833054'),(81,'backend','0063_movimiento_caja_chica','2019-01-12 17:35:18.920725'),(82,'backend','0064_merge_20190107_1904','2019-01-12 17:35:18.923109'),(83,'backend','0065_auto_20190108_2325','2019-01-12 17:35:18.992827'),(84,'backend','0066_auto_20190109_1452','2019-01-12 17:35:19.058323'),(85,'backend','0067_movimiento_numero_oc','2019-01-12 17:35:19.139251'),(86,'backend','0065_auto_20190109_1456','2019-01-12 17:35:19.227407'),(87,'backend','0067_merge_20190109_1736','2019-01-12 17:35:19.230070'),(88,'backend','0068_merge_20190110_1430','2019-01-12 17:35:19.232135'),(89,'backend','0069_movimientobodega_empresa','2019-01-12 17:35:19.398288'),(90,'backend','0070_detallemovbodega_cantidadactual','2019-01-12 17:35:19.469050'),(91,'backend','0071_movimientobodega_no_movimiento','2019-01-14 20:42:53.919845'),(92,'backend','0072_inventario_costo','2019-01-18 21:20:43.673544'),(93,'backend','0073_auto_20190115_1812','2019-01-18 21:20:43.785911'),(94,'backend','0074_auto_20190115_1832','2019-01-18 21:20:43.934621'),(95,'backend','0075_auto_20190116_1552','2019-01-18 21:20:44.396444'),(96,'backend','0076_remove_movimientogranja_tipo','2019-01-18 21:20:44.448367'),(97,'backend','0077_proyecto_tecnico','2019-01-18 21:20:44.555589'),(98,'backend','0078_auto_20190117_1529','2019-01-18 21:20:44.687408'),(99,'backend','0079_cliente','2019-01-18 21:20:44.703851'),(100,'backend','0080_movimiento_es_ov','2019-01-18 21:20:44.789840'),(101,'backend','0081_movimiento_cliente','2019-01-18 21:20:44.904731'),(102,'backend','0082_cambiomoneda','2019-01-22 17:29:17.753370'),(103,'backend','0082_auto_20190121_2244','2019-01-25 20:47:11.461280'),(104,'backend','0083_movimientogranja_hora','2019-01-25 20:47:11.533869'),(105,'backend','0084_proyecto_fechainicio','2019-01-25 20:47:11.657850'),(106,'backend','0085_merge_20190122_1820','2019-01-25 20:47:11.664562'),(107,'backend','0086_auto_20190122_1835','2019-01-25 20:47:11.829539'),(108,'backend','0087_auto_20190122_1923','2019-01-25 20:47:11.859070'),(109,'backend','0088_usuario_caja_venta','2019-01-25 20:47:11.978910'),(110,'backend','0089_auto_20190122_2127','2019-01-25 20:47:12.055100'),(111,'backend','0090_auto_20190122_2141','2019-01-25 20:47:12.144110'),(112,'backend','0091_auto_20190122_2216','2019-01-25 20:47:12.170854'),(113,'backend','0092_movimiento_despacho_inmediato','2019-01-25 20:47:12.251679'),(114,'backend','0092_cuenta_movimientoprestamo','2019-01-25 20:47:12.355850'),(115,'backend','0093_merge_20190124_1702','2019-01-25 20:47:12.359287'),(116,'backend','0094_auto_20190127_1738','2019-02-01 20:26:58.051647'),(117,'backend','0095_preciofraccion','2019-02-01 20:26:58.117000'),(118,'backend','0096_auto_20190128_0308','2019-02-01 20:26:58.196460'),(119,'backend','0097_auto_20190128_0310','2019-02-01 20:26:58.244066'),(120,'backend','0098_auto_20190128_1532','2019-02-01 20:26:58.372283'),(121,'backend','0099_auto_20190129_1559','2019-02-01 20:26:58.559647'),(122,'backend','0100_auto_20190130_2156','2019-02-01 20:26:58.732659'),(123,'backend','0101_auto_20190131_1522','2019-02-01 20:26:59.037185'),(124,'backend','0102_movimiento_preciounitario','2019-02-01 20:26:59.160659'),(125,'backend','0103_detallemovbodega_movimientocosto','2019-02-01 20:26:59.272469'),(126,'backend','0104_movimiento_padrecosto','2019-02-01 20:26:59.412211'),(127,'backend','0105_movimiento_tiene_compra','2019-02-01 20:26:59.501185'),(128,'backend','0106_auto_20190201_2030','2019-02-04 16:54:05.606732'),(129,'backend','0107_movimiento_fecha_inicio_recuperacion','2019-02-04 16:54:05.699209'),(130,'backend','0107_auto_20190201_2255','2019-02-04 16:54:05.962619'),(131,'backend','0108_merge_20190201_2331','2019-02-04 16:54:05.965224'),(132,'backend','0109_proyecto_fecha_inicio_costo','2019-02-04 16:54:06.039776'),(133,'backend','0110_movimiento_fecha_final_recuperacion','2019-02-04 16:54:06.124062'),(134,'backend','0111_auto_20190204_1539','2019-02-04 16:54:06.178055'),(135,'admin','0003_logentry_add_action_flag_choices','2022-09-20 18:13:11.572043'),(136,'auth','0009_alter_user_last_name_max_length','2022-09-20 18:13:11.584144'),(137,'auth','0010_alter_group_name_max_length','2022-09-20 18:13:11.610190'),(138,'auth','0011_update_proxy_permissions','2022-09-20 18:13:11.640990'),(139,'backend','0112_movimiento_categoria_recuperacion','2022-09-20 18:13:11.750829'),(140,'backend','0113_proyecto_categoria_recuperacion','2022-09-20 18:13:11.951575'),(141,'backend','0114_auto_20190207_2153','2022-09-20 18:13:12.072758'),(142,'backend','0115_auto_20190208_1447','2022-09-20 18:13:12.082539'),(143,'backend','0116_proveedor_descripcion','2022-09-20 18:13:12.130529'),(144,'backend','0117_auto_20190212_1742','2022-09-20 18:13:12.174460'),(145,'backend','0118_auto_20190212_1816','2022-09-20 18:13:12.433047'),(146,'backend','0119_auto_20190212_2048','2022-09-20 18:13:12.482347'),(147,'backend','0120_proveedor_direccion','2022-09-20 18:13:12.530785'),(148,'backend','0121_auto_20190320_1847','2022-09-20 18:13:12.678409'),(149,'backend','0122_auto_20190416_2232','2022-09-20 18:13:12.963762'),(150,'backend','0123_auto_20190430_1900','2022-09-20 18:13:13.078879'),(151,'backend','0124_bodega_encargado','2022-09-20 18:13:13.268665'),(152,'backend','0125_ventas_inmediatas_entregado','2022-09-20 18:13:13.524771'),(153,'backend','0126_auto_20190510_1647','2022-09-20 18:13:13.536247'),(154,'backend','0127_auto_20190513_1730','2022-09-20 18:13:13.656187'),(155,'backend','0128_auto_20190513_2033','2022-09-20 18:13:13.800842'),(156,'backend','0129_detallemovbodega_movimiento_original','2022-09-20 18:13:13.854689'),(157,'backend','0130_cierre_movimiento_cierre','2022-09-20 18:13:14.011578'),(158,'backend','0131_auto_20200624_1542','2022-09-20 18:13:14.283044'),(159,'backend','0132_auto_20200624_1624','2022-09-20 18:13:14.458940'),(160,'backend','0133_movimiento_cierre_ventas','2022-09-20 18:13:14.562502'),(161,'backend','0134_auto_20200704_1559','2022-09-20 18:13:14.913365'),(162,'backend','0135_auto_20200704_1626','2022-09-20 18:13:15.685750'),(163,'backend','0136_auto_20200706_1047','2022-09-20 18:13:15.784986'),(164,'backend','0137_auto_20200706_1055','2022-09-20 18:13:15.878621'),(165,'backend','0138_auto_20200708_1547','2022-09-20 18:13:15.975554'),(166,'backend','0139_remove_movimientogranja_postura','2022-09-20 18:13:16.033089'),(167,'backend','0140_auto_20200709_1602','2022-09-20 18:13:16.175542'),(168,'backend','0141_auto_20200709_1629','2022-09-20 18:13:16.280655'),(169,'backend','0142_auto_20200710_1233','2022-09-20 18:13:16.375084'),(170,'backend','0143_auto_20200713_1433','2022-09-20 18:13:16.574659'),(171,'backend','0144_movimientogranja_postura','2022-09-20 18:13:16.627690'),(172,'backend','0145_lineaproduccion_sumar_en_reporte','2022-09-20 18:13:16.694612'),(173,'backend','0146_auto_20200804_1426','2022-09-20 18:13:16.731431'),(174,'backend','0147_migracion_precios','2022-09-20 18:13:16.777423'),(175,'backend','0148_auto_20210126_1252','2022-09-20 18:13:17.231030'),(176,'backend','0149_auto_20210429_1501','2022-09-20 18:13:17.326584');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `session_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-09-27 12:47:38
