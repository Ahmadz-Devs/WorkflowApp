<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
 
        public function up()
        {
            Schema::create('triggers', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->json('parameters');
                $table->timestamps();
            });
        }
        

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('triggers');
    }
};
