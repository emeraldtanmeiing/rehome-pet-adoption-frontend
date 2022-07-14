import React, { useEffect, useState } from "react";
import { omitBy, isNil } from "lodash";
import useQuery from "../../hooks/useQuery";
import useAuthContext from "../../hooks/useAuthContext";
import { getPets } from "../../services/pet.services";
import { calculateAge } from "../../helpers/date";

import { Row, Col, Skeleton, Card, Button, Input, message, Grid } from "antd";
import PetCard from "../../components/petCard/petCard";

import "./pets-listing.less";

const { Search } = Input;

const PetsListing = () => {
  const [pet, setPet] = useState({ status: "idle", data: null });
  const [searchText, setSearchText] = useState("");

  const { accountType } = useAuthContext();

  const fetchPets = async ({ searchText, type }) => {
    setPet({ ...pet, status: "loading" });

    const params = omitBy(
      {
        ...(searchText && { searchText: searchText }),
        ...(type && { type: type }),
        active: true,
        adopted: false,
        sortBy: "createdAt",
        sortMode: "desc",
      },
      (v) => isNil(v) || v.toString().trim() === ""
    );

    const res = await getPets(params);

    if (res?.error) {
      message.error(res.error.description);
    } else {
      let data = res.petsList;

      data = data.filter((d) => {
        return d.rescuerID.verified === true;
      });

      data = data.map((pet) => {
        const age = calculateAge(pet.birthDate);
        return { ...pet, age: age };
      });

      setPet({
        ...pet,
        status: "success",
        data: {
          petsList: data,
          totalResultsFound: data.length,
          page: res.page,
          resultsPerPage: res.resultsPerPage,
        },
      });
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
    fetchPets(null);
  }, []);

  const onSearch = (value) => setSearchText(value.toLowerCase());

  useEffect(() => {
    if (searchText.length === 0 || searchText.length > 1)
      fetchPets({ searchText });
  }, [searchText]);

  const breakpoint = Grid.useBreakpoint();

  return (
    <div className="pets-listing">
      <div className="pets-listing-wrapper">
        <div className="cards">
          {pet.status === "loading" && (
            <>
              <Row gutter={[30, 30]} className="loading">
                {[...Array(12).keys()].map((index) => (
                  <CardSkeleton index={index} key={index} />
                ))}
              </Row>
            </>
          )}

          {pet.status === "success" && (
            <>
              <Row>
                <Col className="filter-bar" align="left">
                  <div>
                    <h1>{pet.data.totalResultsFound} Pets found</h1>
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        fetchPets({});
                      }}
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

              <Row gutter={[30, 30]}>
                {pet.data.petsList.map((p) => {
                  return <PetCard pet={p} accountType={accountType} />;
                })}
              </Row>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetsListing;
