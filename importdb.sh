#!/bin/bash

mysql -u root -proot --protocol=tcp transmit < misc/schema/mysql/transmit.sql
