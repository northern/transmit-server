#!/bin/bash

mysql -u root -p --protocol=tcp transmit < misc/schema/mysql/transmit.sql
