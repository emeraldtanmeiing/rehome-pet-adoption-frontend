import React, { useEffect, useState } from "react";
import { omitBy, isNil } from "lodash";
import { getPets } from "../../services/pet.services";
import { calculateAge } from "../../helpers/date";
import Cookies from "js-cookie";

import {
  Row,
  Col,
  Skeleton,
  Card,
  Button,
  Grid,
  Input,
  Divider,
  message,
} from "antd";
import PetCard from "../../components/petCard/petCard";

import "./pets-listing-rescuer.scss";

const { Search } = Input;

function PetsListingSpecificRescuer() {
  const [pet, setPet] = useState({ status: "idle", data: null });
  const [recentPets, setRecentPets] = useState({ status: "idle", data: null });
  const isLoading = pet.status !== "success" || recentPets.status !== "success";

  useEffect(() => {
    fetchPets();
    fetchRecentPets();
  }, []);

  const accountID = Cookies.get("accountID");
  const accountType = Cookies.get("type");

  const fetchPets = async ({ type, searchText }) => {
    setPet({ ...pet, status: "loading" });

    const params = omitBy(
      {
        ...(type && { type }),
        ...(searchText && { searchText }),
        rescuerID: accountID,
        sortBy: "createdAt",
        sortMode: "desc",
      },
      (v) => isNil(v) || v.toString().trim() === ""
    );

    const res = await getPets(params);

    if (res?.error) {
      message.error(res.error.description);
    } else {
      res.petsList.map((pet) => {
        const age = calculateAge(pet.birthDate);
        pet.age = age;
      });
      setPet({ ...pet, status: "success", data: res });
    }
  };

  const fetchRecentPets = async () => {
    setRecentPets({ ...recentPets, status: "loading" });

    const params = omitBy(
      {
        rescuerID: accountID,
        resultsPerPage: 4,
        sortBy: "createdAt",
        sortMode: "desc",
      },
      (v) => isNil(v) || v.toString().trim() === ""
    );

    const res = await getPets(params);

    if (res?.error) {
      message.error(res.error.description);
    } else {
      res.petsList.map((pet) => {
        const age = calculateAge(pet.birthDate);
        pet.age = age;
      });
      setRecentPets({ ...recentPets, status: "success", data: res.petsList });
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

  const [searchText, setSearchText] = useState("");
  const onSearch = (value) => setSearchText(value.toLowerCase());
  useEffect(() => {
    if (searchText.length === 0 || searchText.length > 1)
      fetchPets({ searchText });
  }, [searchText]);

  const breakpoint = Grid.useBreakpoint();

  return (
    <div className="pets-listing-rescuer">
      <div className="pets-listing-rescuer-wrapper">
        <div className="cards">
          {isLoading && (
            <>
              <Row gutter={[30, 30]} className="loading">
                {[...Array(12).keys()].map((index) => (
                  <CardSkeleton index={index} />
                ))}
              </Row>
            </>
          )}

          {!isLoading && (
            <>
              <Row>
                <Col
                  className="title"
                  align="left"
                  span={breakpoint.md ? 12 : 24}
                >
                  <h1>My Pets</h1>
                </Col>
                <Col
                  className="publish-pet"
                  align={breakpoint.md ? "right" : "left"}
                  span={breakpoint.md ? 12 : 24}
                >
                  <Button type="primary" href="/rescuer/pet/new">
                    Publish a new pet
                  </Button>
                </Col>
              </Row>

              <Row>
                <Col span={24} align="left" className="section">
                  <h2>Recently added</h2>
                </Col>
              </Row>

              <Row gutter={[30, 30]}>
                {recentPets.data.map((p) => (
                  <PetCard pet={p} accountType={accountType} />
                ))}
              </Row>

              <Divider />

              <Row>
                <Col span={24} align="left" className="filter-bar">
                  <h2 className="all-pets">All pets</h2>
                  <div>
                    <Button
                      onClick={() => {
                        fetchPets({});
                      }}
                      className="all-button"
                    >
                      All
                    </Button>
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        fetchPets({ type: "Cat" });
                      }}
                    >
                      Cats
                    </Button>
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        fetchPets({ type: "Dog" });
                      }}
                    >
                      Dogs
                    </Button>
                  </div>
                  <div className="searchbar">
                    <Search
                      placeholder="Search pet by name, description, location..."
                      onSearch={onSearch}
                      enterButton
                      // size="large"
                    />
                  </div>
                </Col>
              </Row>

              <Row>
                <Col align="left">
                  <h3>{pet.data.totalResultsFound} pets found</h3>
                </Col>
              </Row>

              <Row gutter={[30, 30]}>
                {pet.data.petsList.map((p) => (
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

export default PetsListingSpecificRescuer;
