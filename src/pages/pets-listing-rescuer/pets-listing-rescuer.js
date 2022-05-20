import React, { useEffect, useState, useContext } from "react";
import { omitBy, isNil } from "lodash";
import useQuery from "../../hooks/useQuery";
import { getPets } from "../../services/pet.services";
import AuthContext from "../../context/authContext";

import { Row, Col, Skeleton, Card, message } from "antd";
import PetCard from "../../components/petCard/petCard";

import "./pets-listing-rescuer.scss";

function PetsListingSpecificRescuer() {
  const [petState, setPetState] = useState({ status: "idle", data: null });

  useEffect(() => {
    fetchPets();
  }, []);

  const query = useQuery();
  const petID = query.get("petID");
  const type = query.get("type");
  const name = query.get("name");
  const ageInMonths = query.get("ageInMonths");
  const rescuerID = query.get("rescuerID");
  const resultsPerPage = query.get("resultsPerPage");
  const page = query.get("page");

  const fetchPets = async () => {
    setPetState({ ...petState, status: "loading" });

    const params = omitBy(
      { petID, type, name, ageInMonths, rescuerID, resultsPerPage, page },
      isNil
    );

    const res = await getPets(params);

    if (res?.error) {
      message.error(res.error.description);
    } else {
      setPetState({ ...petState, status: "success", data: res });
    }
  };

  const CardSkeleton = (index) => {
    return (
      <>
        <Col xxl={6} xl={6} lg={6} md={8} sm={12} xs={12}>
          <Card key={index}>
            <Skeleton avatar active />
          </Card>
        </Col>
      </>
    );
  };

  const Auth = useContext(AuthContext);
  const accountType = Auth.auth?.type;

  return (
    <div className="pets-listing-rescuer">
      <h1>My pets</h1> Pet listing for a specific rescuer page

      <div className="pets-listing-rescuer-container">

        

        <div className="cards">
          {petState.status === "loading" && 
            <>
              <Row gutter={[30, 30]}>
                {[...Array(12).keys()].map((index) => (
                  <CardSkeleton index={index} />
                ))}
              </Row>
            </>
          }

          {petState.status === "success" && 
            <>
              <div className="search-bar"> Search bar will be implemented later </div>
            
              <h2>{petState.data.totalResultsFound} pets found</h2>

              <Row gutter={[30, 30]}>
                {petState.data.petsList.map((p) => (
                  <PetCard pet={p} accountType={accountType}/>
                ))}
              </Row>
            </>
          }
        </div>

      </div>
    </div>
  );
}

export default PetsListingSpecificRescuer;
