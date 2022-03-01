<?php
    class User {
        // Properties
        public $name;

        // Constructor
        function __construct($name) {
            $this->name = $name;
        }
        
        // Methods
        function set_name($name)
        {
            $this->name = $name;
        }
        function get_name()
        {
            return $this->name;
        }

        function tostring() {
            return $this->name;
        }
    }

    $user1 = new User("Tuan1");
    $user2 = new User("Tuan2");
    $user3 = new User("Tuan3");

    $data = array($user1 , $user2, $user3);
?>