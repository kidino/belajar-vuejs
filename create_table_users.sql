CREATE TABLE `users` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`username` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',
	`name` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`age` INT(11) NULL DEFAULT NULL,
	`status` ENUM('Active','Inactive') NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=6
;
