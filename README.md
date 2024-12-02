# MIKCLOUD: ISP Management system

[logo here]

This is a project work for the course "CPS 104 Project Work" at Accra technical university, Department of Computer Science. You will see a bunch of newbie mistakes and unnecessary code in this project. I'm sorry in advance.

[stats here]

[product image here]

- [MikCloud ISP management 'system'](#mikcloud--management-system)
  - [Documentation](#documentation)
  - [Installation](#installation)
    - [Requirements](#requirements)
    - [Installation](#installation-1)
  - [Development](#development)
    - [Running the application](#running-the-application)
    - [Running the tests](#running-the-tests)
  - [Production](#production)
    - [Building the application](#building-the-application)
    - [Running the application](#running-the-application-1)
  - [License](#license)

## Documentation

The documentation for the MIKCLOUD ISP Management system can be found in the `docs` directory. It includes detailed information on the system architecture, design decisions, and usage instructions.

## Features

## Installation

### Requirements

- Python 3.8+
- Django 3.2+
- PostgreSQL 12+
- Node.js 14+
- npm 6+

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/mikcloud.git
   cd mikcloud
   ```

2. Create a virtual environment and activate it:

   ```sh
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install the required Python packages:

   ```sh
   pip install -r requirements.txt
   ```

4. Install the required Node.js packages:

   ```sh
   cd frontend
   npm install
   cd ..
   ```

5. Set up the PostgreSQL database and update the `DATABASES` setting in `mikcloud/settings.py` with your database credentials.

6. Apply the database migrations:

   ```sh
   python manage.py migrate
   ```

7. Create a superuser:
   ```sh
   python manage.py createsuperuser
   ```

## Development

### Running the application

To run the application locally, use the following command:

```sh
command here
```

### Running the tests

To run the tests, use the following command:

```sh
command here
```

## Production

### Building the application

To build the application for production, use the following command:

```sh
command here
```

### Running the application

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
