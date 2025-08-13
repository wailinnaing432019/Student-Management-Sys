<!DOCTYPE html>
<html lang="my">

<head>
    <meta charset="UTF-8">
    <style>
        /* @font-face {
            font-family: 'pyidaungsu';
            src: url('{{ storage_path('fonts/Pyidaungsu-2.5.3_Regular.ttf') }}') format('truetype');
            font-weight: normal;
            font-style: normal;
        } */

        body {
            font-family: 'pyidaungsu', sans-serif;
            font-size: 16pt;
        }

        /* .heading {
            font-size: 18px;
            font-weight: bold;
        } */

        table {
            width: 100%;
            border-collapse: collapse;
        }

        td,
        th {
            padding: 8px;
            border: 1px solid #ddd;
        }
    </style>
</head>

<body>
    <div class="heading">ကျောင်းသားအမည် မင်္ကလာပါ Student</div>
    <table>
        <tr>
            <th>အမည်</th>
            <th>အမည်</th>
            <th>အမည်</th>
            {{-- <td>{{ $student->name_eng }}</td> --}}
        </tr>

        <tr>
            <td>မောင်မောင်</td>
            <td>ကို ကို</td>
            <td>ကိုကို</td>
            {{-- <td>{{ $student->dob }}</td> --}}
        </tr>
    </table>
</body>

</html>
