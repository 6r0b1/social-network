import React from "react";
import { useState, useEffect } from "react";

function FindPpl() {
    const [resultsLegend, setResultsLegend] = useState(
        "Here are the last 3 who joined the fun:"
    );
    const [others, setOthers] = useState([]);
    const [searchString, setSearchString] = useState("");

    useEffect(() => {
        fetch("/api/others")
            .then((result) => result.json())
            .then((othersData) => {
                setOthers([...othersData]);
            });
    }, []);

    useEffect(() => {
        fetch(`/api/others/${searchString}`)
            .then((result) => result.json())
            .then((othersData) => {
                setOthers([...othersData]);
                if (searchString !== "") {
                    setResultsLegend(
                        `Here are some people who's names match » ${searchString} «`
                    );
                } else {
                    setResultsLegend(`Here are the last 3 who joined the fun:`);
                }
            });
    }, [searchString]);

    function updateQuery(e) {
        setSearchString(e.target.value);
    }

    return (
        <>
            <div className="results">
                <h2>Find People</h2>
                <input
                    type="text"
                    name="othersQuery"
                    id=""
                    placeholder="Looking for s/o?"
                    onChange={updateQuery}
                />
                <p>{resultsLegend}</p>
                {others.map((user) => (
                    <div className="results_entry" key={user.id}>
                        <img
                            className="profile_picture_results"
                            src={user.user_picture_url}
                            alt=""
                        />
                        <h2 className="results">
                            {user.firstname} {user.lastname}
                        </h2>
                    </div>
                ))}
            </div>
        </>
    );
}

export default FindPpl;
