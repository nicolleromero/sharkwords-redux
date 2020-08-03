from flask import Flask, render_template


app = Flask(__name__)


@app.route("/")
def sharkwords_redux():
    return render_template("sharkwords-redux.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
