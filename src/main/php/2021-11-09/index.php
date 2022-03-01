<html>
<-- form.html CS443 -->
<body>

<div>
    <h1>insert</h1>
    <form action="insert.php" method="post">
    Enter your name: <input type="text" name="name" /> <br/>
    Enter your age: <input type="text" name="age" /> <br/>
    <input type="submit" />
    </form>
</div>

<div>
    <h1>update</h1>
    <form action="update.php" method="post">
    Enter your id: <input type="text" name="id" /> <br/>
    Enter your name: <input type="text" name="name" /> <br/>
    Enter your age: <input type="text" name="age" /> <br/>
    <input type="submit" />
    </form>
</div>

<div>
    <h1>info</h1>
    <form action="info.php" method="post">
    Enter your id: <input type="text" name="id" /> <br/>
    <input type="submit" />
    </form>
</div>

</body>
</html>