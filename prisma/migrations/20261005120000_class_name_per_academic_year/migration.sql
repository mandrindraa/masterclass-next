DROP INDEX "classes_level_key";

CREATE UNIQUE INDEX "classes_name_academic_year_id_key"
ON "classes"("name", "academic_year_id");