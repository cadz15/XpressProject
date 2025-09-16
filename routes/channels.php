<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('notification', function ($user) {
    return true; // Allow only authenticated users
});


Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
