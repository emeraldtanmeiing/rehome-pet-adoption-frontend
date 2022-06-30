import React, { useEffect, useState } from "react";
import { omitBy, isNil, sortBy, trim } from "lodash";
import useQuery from "../../hooks/useQuery";
import useAuthContext from "../../hooks/useAuthContext";
import { getPets } from "../../services/pet.services";
import { calculateAge } from "../../helpers/date";
import { useNavigate } from "react-router-dom";

import { Row, Col, Skeleton, Card, Button, message } from "antd";
import PetCard from "../../components/petCard/petCard";

import "./pets-listing.scss";

function PetsListing() {
  const [petState, setPetState] = useState({ status: "idle", data: null });

  const query = useQuery();
  const petID = query.get("petID");
  const type = query.get("type");
  const name = query.get("name");
  // const ageInMonths = query.get("ageInMonths");
  const rescuerID = query.get("rescuerID");
  const resultsPerPage = query.get("resultsPerPage");
  const page = query.get("page");

  const { accountType } = useAuthContext();

  const fetchPets = async () => {
    setPetState({ ...petState, status: "loading" });

    const params = omitBy(
      { petID, type, name, rescuerID, resultsPerPage, page, active: true, adopted: false },
      v => isNil(v) || v.toString().trim() === ''
    );

    //TODO: IMPORTANT: only get {active:true, adopted:false} pets
    const res = await getPets(params);

    if (res?.error) {
      message.error(res.error.description);
    } else {
      res.petsList.map((pet) => {
        const age = calculateAge(pet.birthDate)
        pet.age = age;
      });
      const data = {
        ...res,
        petsList: sortBy(res.petsList, "createdAt").reverse(),
      };
      setPetState({ ...petState, status: "success", data: data });
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

  useEffect(() => {
    fetchPets();
  }, []);

  return (
    <div className="pets-listing">
      <div className="pets-listing-wrapper">
        <div className="cards">
          {petState.status === "loading" && (
            <>
              <Row gutter={[30, 30]} className="loading">
                {[...Array(12).keys()].map((index) => (
                  <CardSkeleton index={index} key={index}/>
                ))}
              </Row>
            </>
          )}

          {petState.status === "success" && (
            <>
              <Row>
                <Col className="filter-bar" align="left">
                  <div>
                    <h1>{petState.data.totalResultsFound} pets found</h1>
                  </div>
                  <div>
                    <Button href={`/pets-listing`}>All</Button>
                  </div>
                  <div>
                    <Button href={`/pets-listing?type=Cat`}>Cats</Button>
                  </div>
                  <div>
                    <Button href={`/pets-listing?type=Dog`}>Dogs</Button>
                  </div>
                </Col>
              </Row>

              <Row gutter={[30, 30]}>
                {petState.data.petsList.map((p) => (
                  <PetCard pet={p} accountType={accountType} />
                ))}
              </Row>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PetsListing;
